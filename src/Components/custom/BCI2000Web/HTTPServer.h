////////////////////////////////////////////////////////////////////////////////
// $Id: $
// Authors: griffin.milsap@gmail.com
// Description: A simple HTTP server that runs inside a BCI2000
//   operator module.
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
#ifndef HTTP_SERVER_H
#define HTTP_SERVER_H

#include "BCI2000Connection.h"
#include "Thread.h"
#include "Lockable.h"
#include "Mutex.h"
#include "Sockets.h"
#include <list>

class HTTPServer : public Thread, public BCI2000Connection
{
 public:
  HTTPServer( const std::string& address, const std::string& webRoot );
  ~HTTPServer();

  // Thread interface
  int OnExecute();

  // BCI2000Connection interface
  bool OnInput( std::string& in );
  bool OnOutput( const std::string& out );

  // Hide Execute and substitute a thread-safe version
  bool Execute( const std::string& cmd, int* exitCode /*= 0*/ )
    { WithLock( mExecuteLock ) return BCI2000Connection::Execute( cmd, exitCode ); return false; }

  void Log( const std::string& msg ) { Execute( "LOG BCI2000Web: " + msg, NULL ); }
  void Warn( const std::string& msg ) { Execute( "WARN BCI2000Web: " + msg, NULL ); }
  void Error( const std::string& msg ) { Execute( "ERROR BCI2000Web: " + msg, NULL ); }

 private:
  std::string mWebRoot;
  ServerTCPSocket mListeningSocket;
  Lockable<Mutex> mExecuteLock;

  class Session;
  friend class Session;

  struct : std::list<Session*>, Lockable<NonrecursiveSpinLock> {} mSessions;
};


#endif // HTTP_SERVER_H
