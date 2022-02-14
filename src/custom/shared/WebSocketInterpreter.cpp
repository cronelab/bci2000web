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
#include "WebSocketInterpreter.h"
#include "HTTPInterpreter.h"
#include "sha1.h"
#include "base64.h"

using namespace std;

void
WebSocketInterpreter::Listen( Thread* pThread, Socket& socket, iostream& stream, const string& key )
{
  const int cTimeoutMs = 100;
  const int cHashSize = 20;

  BYTE hash[ cHashSize ];
  string combinedKey = key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
  BYTE* input = new BYTE[ combinedKey.size() ];
  ::memcpy( input, combinedKey.c_str(), combinedKey.size() );

  SHA1_CTX context;
  sha1_init( &context );
  sha1_update( &context, input, combinedKey.size() );
  sha1_final( &context, hash );

  size_t out_size = base64_encode( input, NULL, cHashSize, 1 );
  BYTE* b64_hash = new BYTE[ out_size ];
  base64_encode( hash, b64_hash, cHashSize, 1 );
  string result( reinterpret_cast< char const* >( b64_hash ), out_size );

  delete [] input;
  delete [] b64_hash;

  HTTPInterpreter::Header hdr;
  hdr[ "upgrade" ] = "websocket";
  hdr[ "connection" ] = "Upgrade";
  hdr[ "sec-websocket-accept" ] = result;

  WithLock( mStreamLock )
    HTTPInterpreter::HTTPRespond( stream, 101, hdr );

  mConnected = true;
  OnConnect();

  while( !pThread->Terminating() && stream )
  {
    if( socket.Wait( Time::FromIntTimeout( cTimeoutMs ) ) )
    {
      // If the socket closed abnormally for whatever reason,
      // this will break out of an infinite loop
      if( stream.rdbuf()->in_avail() == 0 ) break;

      vector< pair< char, string > > msgs;
      WithLock( mStreamLock )
        while( stream.rdbuf()->in_avail() && stream )
        {
          char data = stream.get();
          bool fin = data & 0x80;
          char opcode = data & 0x0F;
          data = stream.get();
          bool mask = data & 0x80;
          uint64_t payloadLen = data & 0x7F;
          if( payloadLen == 126 )
          {
            uint16_t shortLen;
            ReadBytes( stream, shortLen );
            payloadLen = shortLen;
          }
          else if ( payloadLen == 127 )
            ReadBytes( stream, payloadLen );

          ostringstream payload;
          if( payloadLen && stream )
          {
            char key[ 4 ];
            if( mask ) for( int i = 0; i < 4; ++i )
              key[ i ] = stream.get();
            for( uint64_t i = 0; ( i < payloadLen ) && stream.rdbuf()->in_avail(); i++ )
              payload << char( ( mask ) ? ( stream.get() ^ key[ i % 4 ] ) : stream.get() );
          }
          string strPayload = payload.str();
          msgs.push_back( make_pair( opcode, strPayload ) );

          // MUST NOT WRITE TO STREAM IN OnFrame!!!
          OnFrame( strPayload );
        }

      bool closing = false;
      for( size_t i = 0; i < msgs.size(); i++ )
        switch( msgs[i].first ) {
          case Text:
            OnTextMessage( msgs[i].second ); break;
          case Binary:
            OnBinaryMessage( msgs[i].second ); break;
          case Ping:
            WriteMessage( stream, Pong, msgs[i].second );
            OnPing( msgs[i].second );
            break;
          case Pong:
			mListening=true;
            OnPong(); break;
          case Close: // Pass Through
          default: closing = true;
        }
      if( closing ) break;
    }
  }

  mConnected = false;
  WriteMessage( stream, Close );
  OnClose();
}

void
WebSocketInterpreter::WriteMessage( ostream& stream, Opcode op, const string& msg )
{
  if( mConnected && stream )
    WithLock( mStreamLock )
    {
      WriteBytes( uint8_t( 0x80 | uint8_t( op ) ), stream );
      if( msg.size() == 0 )
        WriteBytes( uint8_t( 0x00 ), stream );
      else
      {
        if( msg.size() <= 125 )
          WriteBytes( uint8_t( msg.size() ), stream );
        else if( msg.size() > 125 && msg.size() <= 0XFFFF )
        {
          WriteBytes( uint8_t( 0x7E ), stream );
          WriteBytes( uint16_t( msg.size() ), stream );
        } else {
          WriteBytes( uint8_t( 0x7F ), stream );
          WriteBytes( uint64_t( msg.size() ), stream );
        }
        stream.write( msg.c_str(), msg.size() );
      }
      stream.flush();
    }
}
