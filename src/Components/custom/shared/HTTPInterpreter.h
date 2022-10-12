////////////////////////////////////////////////////////////////////////////////
// $Id: $
// Authors: griffin.milsap@gmail.com
// Description: Provides a basic HTTP implementation
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
#ifndef HTTP_INTERPRETER_H
#define HTTP_INTERPRETER_H

#include "Sockets.h"
#include "Thread.h"

#include <map>
#include <string>
#include <iostream>

class HTTPInterpreter
{
 public:
  typedef std::map< std::string, std::string > Header;

  void HTTPListen( Thread* pThread, Socket& socket, std::istream& stream );
  static void HTTPRespond( std::ostream& stream, int status, Header& hdr = Header(), const std::string& msg = "" );

  struct HTTPMessage
  {
    std::string command;
    std::string resource;
    std::string httpVer;
    Header header;
    std::string content;
  };
   
 protected:
  // Return true to keep session alive, return false to kill session
  virtual bool OnRequest( const HTTPMessage& msg ) { return true; }
  virtual void Debug( const std::string& msg ) { }

 private:
  Lockable< Mutex > mStreamLock;
};

#endif //HTTP_INTERPRETER_H