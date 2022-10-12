////////////////////////////////////////////////////////////////////////////////
// $Id: $
// Author: griffin.milsap@gmail.com
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

#include "WSIOFilter.h"
#include "HTTPInterpreter.h"
#include "WebSocketInterpreter.h"
#include "Streambuf.h"
#include "BCIException.h"
#include "FileUtils.h"

#include <string>
#include <sstream>
#include <fstream>

using namespace std;
using namespace bci;

class WSIOFilter::Connection : public Environment, private Thread, private WebSocketInterpreter, private HTTPInterpreter
{
 public:
  Connection( WSIOFilter* parent );

  // Thread Interface
  int OnExecute();

  // HTTPInterpreter interface
  bool OnRequest( const HTTPMessage& );

  void OnConnect();
  void WriteMessages( const GenericSignal &signal );
  void Abort();

 private:
  ~Connection();
  Synchronized<WSIOFilter*> mpParent;

  TCPSocket mSocket;
  BufferedIO mBuffer;
  iostream mStream;

  Lockable< Mutex > mWriteLock;

  friend class HTTPInterpreter;
  friend class WebSocketInterpreter;

};


WSIOFilter::WSIOFilter( string section, string name, uint16_t default_port )
{
  mAddressPrm = "WS" + name + "Server";

  ostringstream ss;
  ss << section << " string " << mAddressPrm << "= % localhost:" << default_port << " % % ";
  ss << "// IP address/port to host a WebSocketServer on, e.g. localhost:" << default_port;
  BEGIN_PARAMETER_DEFINITIONS
    ss.str().c_str(),
  END_PARAMETER_DEFINITIONS
}

WSIOFilter::~WSIOFilter()
{
  Halt();
}

void
WSIOFilter::Preflight( const SignalProperties& inSignalProperties,
                             SignalProperties& outSignalProperties ) const
{
  string address = string( Parameter( mAddressPrm ) );
  if( address != "" )
  {
    ServerTCPSocket preflightSocket;
    preflightSocket.Open( address );
    if( !preflightSocket.IsOpen() )
      bcierr << "Could not start server on " << address << endl;
    preflightSocket.Close();
  }

  // Pre-flight access each state in the list.
  for( int state = 0; state < States->Size(); ++state )
    State( ( *States )[ state ].Name() );

  outSignalProperties = inSignalProperties;
}

void
WSIOFilter::Initialize( const SignalProperties&, const SignalProperties& Output )
{
  string connectorAddress = string( Parameter( mAddressPrm ) );
  mProperties = Output;
  stringstream sStateFormat;
  States->InsertInto( sStateFormat );
  mStateVectorFormat = sStateFormat.str();

  if( connectorAddress != "" )
  {
    mListeningSocket.SetTCPNodelay( true );
    mListeningSocket.Open( connectorAddress );
    if( !mListeningSocket.IsOpen() )
      throw bciexception << "Cannot listen at " << connectorAddress;
    Thread::Start();
  }
}

void
WSIOFilter::Halt()
{
  if( mListeningSocket.IsOpen() )
    mListeningSocket.Close();
  list<Connection*> c;
  WithLock( mConnections )
    c = mConnections;
  for( list<Connection*>::iterator i = c.begin(); i != c.end(); ++i )
    (*i)->Abort();
  if( Thread::Running() )
    Thread::TerminateAndWait();
}

int
WSIOFilter::OnExecute()
{
  while( mListeningSocket.Wait() )
    new Connection( this );
  return 0;
}

void
WSIOFilter::StartRun()
{

}

void
WSIOFilter::StopRun()
{

}

void
WSIOFilter::Process( const GenericSignal& Input, GenericSignal& Output )
{
  Output = Input;
  for( list< Connection* >::iterator i = mConnections.begin(); i != mConnections.end(); ++i )
    ( *i )->WriteMessages( Input );
  bcidbg << "Running Process" <<endl;
}

WSIOFilter::Connection::Connection( WSIOFilter* pParent ) :
  Thread( true ),
  mpParent( pParent ),
  mStream( &mBuffer )
{
  mBuffer.SetIO( &mSocket );
  WithLock( mpParent->mConnections )
    mpParent->mConnections.push_back( this );
  mpParent->mListeningSocket.WaitForAccept( mSocket, 0 );
  Thread::Start();
}

WSIOFilter::Connection::~Connection()
{
  WithLock( mpParent->mConnections )
    mpParent->mConnections.remove( this );
}

void
WSIOFilter::Connection::Abort()
{
  Thread::TerminateAndWait();
}

int
WSIOFilter::Connection::OnExecute()
{
  HTTPInterpreter::HTTPListen( this, mSocket, mStream );
  return 0;
}

bool
WSIOFilter::Connection::OnRequest( const HTTPInterpreter::HTTPMessage& msg )
{
  if( msg.command == "GET" )
  {
    Header::const_iterator upgrade = msg.header.find( "upgrade" );
    if( upgrade != msg.header.end() && (
      upgrade->second.find( "websocket" ) != string::npos ||
      upgrade->second.find( "WebSocket" ) != string::npos ) )
    {
      // Upgrade connection to websocket protocol
      Header::const_iterator key = msg.header.find( "sec-websocket-key" );
      if( key == msg.header.end() ) return false;
      WebSocketInterpreter::Listen( this, mSocket, mStream, key->second );
    } else HTTPRespond( mStream, 404 );
    return false;

  } else {

    // This interface only supports GET requests for websockets
    HTTPRespond( mStream, 500 );
    return false;
  }

  // Should never get here, something bad happened
  return false;


}

void
WSIOFilter::Connection::OnConnect()
{
  // Serialize the StateFormat
  stringstream sStateFormat;
  sStateFormat << uint8_t( 0x03 ) << mpParent->mStateVectorFormat;
  WriteMessage( mStream, Opcode::Binary, sStateFormat.str() );

  // Serialize the SignalProperties
  stringstream sSignalProperties;
  sSignalProperties << uint8_t( 0x04 ) << uint8_t( 0x03 );
  mpParent->mProperties.InsertInto( sSignalProperties );
  WriteMessage( mStream, Opcode::Binary, sSignalProperties.str() );
}

void
WSIOFilter::Connection::WriteMessages( const GenericSignal& signal )
{
	WriteMessage(mStream, Ping, "A");

	if( Connected() && Listening())
	{

		// Serialize the GenericSignal
		stringstream ssSignal;
		ssSignal << uint8_t( 0x04 ) << uint8_t( 0x01 );
		signal.Serialize( ssSignal );
		WriteMessage( mStream, Opcode::Binary, ssSignal.str() );

		// Serialize the State Vector
		stringstream ssStates;
		ssStates << uint8_t( 0x05 );
		Statevector->Serialize( ssStates );
		WriteMessage( mStream, Opcode::Binary, ssStates.str() );

		mListening = false;
   }
}
