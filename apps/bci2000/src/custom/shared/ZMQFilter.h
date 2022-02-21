////////////////////////////////////////////////////////////////////////////////
// $Id: $
// Author: Shiyu Luo <sluo15@jhu.edu>
// Description: A filter that sends signals over a TCP facilitated ZMQ connection.
//          Can be instantiated several times using subclasses. 
//			Can be subscribed by multiple subscriber.
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
#ifndef ZMQ_FILTER_H
#define ZMQ_FILTER_H

#include "GenericFilter.h"

#include "Sockets.h"
// #include "Lockable.h"
// #include "Thread.h"
//#include "zmq.h"
#include "zmq.hpp"

#include <iostream>
#include <list>

class ZMQFilter : public GenericFilter
{
 public:
  ZMQFilter( std::string section, std::string name, uint16_t default_port );
  virtual ~ZMQFilter();
  virtual void Preflight( const SignalProperties&, SignalProperties& ) const;
  virtual void Initialize( const SignalProperties&, const SignalProperties& );
  virtual void Process( const GenericSignal&, GenericSignal& );
  virtual void Halt();
  virtual void StartRun();


protected:
	std::string mAddressPrmLast;

private:
	std::string mStateVectorFormat;
	SignalProperties mProperties;
	std::string mAddressPrm;

};
#endif // ZMQ_FILTER_H


