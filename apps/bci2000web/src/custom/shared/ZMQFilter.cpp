////////////////////////////////////////////////////////////////////////////////
// $Id: $
// Author: Shiyu Luo <sluo15@jhu.edu>
// Description: A filter that sends/receives states and signals over a
//         TCP facilitated WebSocket (RFC6455) connection. Can be instantiated
//         several times using subclasses
//
// $BEGIN_BCI2000_LICENSE$
//
// This file is part of BCI2000, a platform for real-time bio-signal research.
// [ Copyright (C) 2000-2012: BCI2000 team and many external contributors ]
//
// BCI2000 is free software: you can redistribute it and/or modify it under the
// terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// BCI2000 is distributed in the hope that it will be useful, but
//                         WITHOUT ANY WARRANTY
// - without even the implied warranty of MERCHANTABILITY or FITNESS FOR
// A PARTICULAR PURPOSE.  See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program.  If not, see <http://www.gnu.org/licenses/>.
//
// $END_BCI2000_LICENSE$
////////////////////////////////////////////////////////////////////////////////
#include "PCHIncludes.h"
#pragma hdrstop

#include "ZMQFilter.h"
#include "Streambuf.h"
#include "BCIException.h"
#include "FileUtils.h"

#include <string>
#include <sstream>
#include <fstream>

using namespace std;
using namespace bci;

zmq::context_t context(1);
zmq::socket_t publisher(context, ZMQ_PUB);

ZMQFilter::ZMQFilter(string section, string name, uint16_t default_port)
{
  mAddressPrm = "ZMQ" + name + "Server";
  mAddressPrmLast = " ";

  ostringstream ss;
  ss << section << " string " << mAddressPrm << "= % localhost:" << default_port << " % % ";
  ss << "// TCP port to host a ZMQ Connection on, e.g. localhost:" << default_port;
  BEGIN_PARAMETER_DEFINITIONS
  ss.str().c_str(),
      END_PARAMETER_DEFINITIONS
}

ZMQFilter::~ZMQFilter()
{
  Halt();
}

void ZMQFilter::Preflight(const SignalProperties &inSignalProperties,
                          SignalProperties &outSignalProperties) const
{
  string connectorAddress = string(Parameter(mAddressPrm));
  outSignalProperties = inSignalProperties;
}

void ZMQFilter::Initialize(const SignalProperties &, const SignalProperties &Output)
{
  string connectorAddress = string(Parameter(mAddressPrm));
  mProperties = Output;

  if (mAddressPrmLast != connectorAddress)
  {
    publisher.bind("tcp://*:" + connectorAddress);
    mAddressPrmLast = connectorAddress;
  } // cannot bind twice to the same address
}
void ZMQFilter::StartRun()
{
	stringstream sStateFormat;
	sStateFormat << uint8_t(0x03);
	States->Serialize(sStateFormat);
	const std::string tmp3 = sStateFormat.str();             //to string
	const char* sStateFormat_char = tmp3.c_str();            //null-terminated
	zmq::message_t message3(tmp3.size());                    //declare message
	memcpy(message3.data(), sStateFormat_char, tmp3.size()); //memory to memory from char to data
	publisher.send(message3);

	stringstream sSignalProperties;
	sSignalProperties << uint8_t(0x04) << uint8_t(0x03);
	mProperties.InsertInto(sSignalProperties);
	const std::string tmp4 = sSignalProperties.str();             //to string
	const char* sSignalProperties_char = tmp4.c_str();            //null-terminated
	zmq::message_t message4(tmp4.size());                         //declare message
	memcpy(message4.data(), sSignalProperties_char, tmp4.size()); //memory to memory from char to data
	publisher.send(message4);

}

void ZMQFilter::Process(const GenericSignal &Input, GenericSignal &Output)
{
  Output = Input;

  // Serialize the StateVector
  stringstream ssStates;
  ssStates << uint8_t(0x05);
  Statevector->Serialize(ssStates);
  const std::string tmp2 = ssStates.str();             //to string
  const char *ssStates_char = tmp2.c_str();            //null-terminated
  zmq::message_t message2(tmp2.size());                //declare message
  memcpy(message2.data(), ssStates_char, tmp2.size()); //memory to memory from char to data
  publisher.send(message2);

  // Serialize the GenericSignal
  stringstream ssSignal;
  ssSignal << uint8_t(0x04) << uint8_t(0x01);
  Input.Serialize(ssSignal);                         //sterilized input
  const std::string tmp = ssSignal.str();            //to string
  const char *ssSignal_char = tmp.c_str();           //null-terminated
  zmq::message_t message(tmp.size());                //declare message
  memcpy(message.data(), ssSignal_char, tmp.size()); //memory to memory from char to data
  publisher.send(message);
}

void ZMQFilter::Halt()
{
}