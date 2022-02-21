////////////////////////////////////////////////////////////////////////////////
// $Id: $
// Authors: griffin.milsap@gmail.com
// Description: A basic implementation of the WebSocket Protocol
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
#ifndef WEBSOCKET_INTERPRETER_H
#define WEBSOCKET_INTERPRETER_H

#include "Thread.h"
#include "Sockets.h"

#include <string>
#include <iostream>

class HTTPInterpreter;

class WebSocketInterpreter
{
 public:
  WebSocketInterpreter() : mConnected( false ) { }

  enum Opcode
  {
    Text = 0x01,
    Binary = 0x02,
    Close = 0x08,
    Ping = 0x09,
    Pong = 0x0A
  };

  void Listen( Thread* pThread, Socket& socket, std::iostream& stream, const std::string& key );
  void WriteMessage( std::ostream& stream, Opcode op, const std::string& msg = "" );

  bool Connected() { return mConnected; }
  bool Listening() { return mListening; }

 protected:
  virtual void OnConnect() { }
  virtual void OnFrame( const std::string& data ) { }
  virtual void OnTextMessage( const std::string& data ) { }
  virtual void OnBinaryMessage( const std::string& data ) { }
  virtual void OnPing( const std::string& data ) { }
  virtual void OnPong() { }
  virtual void OnClose() { }

 protected:
  Lockable< Mutex > mStreamLock;
  bool mConnected;
  bool mListening;

  template<typename T>
  static void WriteBytes( T t, std::ostream& os )
  {
    for( int i = sizeof( T ) - 1; i >= 0; --i )
      os.put( ( t >> ( i * 8 ) ) & 0xff );
  }

  template<typename T>
  static void ReadBytes( std::istream& is, T& t )
  {
    t = 0;
    for( size_t i = 0; i < sizeof( T ); ++i )
    {
      uint8_t c = is.get();
      t <<= 8;
      t |= c;

    }
  }
};

#endif // WEBSOCKET_INTERPRETER
