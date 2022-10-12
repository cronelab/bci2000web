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
#ifndef WSIO_FILTER_H
#define WSIO_FILTER_H

#include "GenericFilter.h"

#include "Sockets.h"
#include "Lockable.h"
#include "Thread.h"

#include <iostream>
#include <list>

class WSIOFilter : public GenericFilter, public Thread
{
 public:
          WSIOFilter( std::string section, std::string name, uint16_t default_port );
  virtual ~WSIOFilter();
  virtual void Preflight( const SignalProperties&, SignalProperties& ) const;
  virtual void Initialize( const SignalProperties&, const SignalProperties& );
  virtual void Halt();
  virtual void StartRun();
  virtual void StopRun();
  virtual void Process( const GenericSignal&, GenericSignal& );
  virtual bool AllowsVisualization() const { return false; }

 protected:
  int OnExecute();

 private:
  void DeleteServers();

  std::string mStateVectorFormat;
  SignalProperties mProperties;
  std::string mAddressPrm;
  ServerTCPSocket mListeningSocket;
  std::string mWebRoot;

  class Connection;
  friend class Connection;
  struct : std::list<Connection*>, Lockable<NonrecursiveSpinLock> {} mConnections;
};
#endif // WSIO_FILTER_H


