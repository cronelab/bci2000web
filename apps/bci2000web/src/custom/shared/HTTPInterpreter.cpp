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
#include "HTTPInterpreter.h"

using namespace std;

string strip( const string& in )
{
  const string whitespace( " \t\f\v\n\r" );
  size_t start = in.find_first_not_of( whitespace );
  if( start == string::npos ) return "";
  size_t end = in.find_last_not_of( whitespace );
  size_t size = end - start;
  return in.substr( start, size + 1 );
}

// Define some of the more common HTTP status codes
map< int, std::string > InitStatus()
{
  std::map< int, std::string > status;

  // Informational
  status[ 100 ] = "Continue";
  status[ 101 ] = "Switching Protocols";

  // Success
  status[ 200 ] = "OK";
  status[ 201 ] = "Created";
  status[ 202 ] = "Accepted";
  status[ 204 ] = "No Content";
  status[ 205 ] = "Reset Content";

  // Redirection
  status[ 301 ] = "Moved Permanently";
  status[ 303 ] = "See Other";
  status[ 307 ] = "Temporary Redirect";
  status[ 308 ] = "Permanent Redirect";

  // Client Error
  status[ 400 ] = "Bad Request";
  status[ 401 ] = "Unauthorized";
  status[ 403 ] = "Forbideden";
  status[ 404 ] = "Not Found";
  status[ 418 ] = "I'm a teapot";
  
  // Server Error
  status[ 500 ] = "Internal Server Error";
  status[ 501 ] = "Not Implemented";

  return status;
}

map< int, string > HTTPStatusCodes = InitStatus();

void
HTTPInterpreter::HTTPListen( Thread* pThread, Socket& socket, istream& stream )
{
  const int cKeepAliveTime = 10000;
  const int cTimeoutTime = 100;
  int aliveTime = 0;

  while( !pThread->Terminating() && stream )
  {
    if( socket.Wait( Time::FromIntTimeout( cTimeoutTime ) ) ) {
      if( stream.rdbuf()->in_avail() == 0 ) break; // Break infinite loop

      aliveTime = 0;
      HTTPMessage msg;
      string preamble;
      while( strip( preamble ).empty() )
        ::getline( stream, preamble );
      istringstream iss( preamble );
      iss >> msg.command >> msg.resource >> msg.httpVer;

      // Parse Header
      while( stream.rdbuf()->in_avail() )
      {
        string option;
        ::getline( stream, option );
        option = strip( option );
        if( option.empty() ) break;
            
        size_t kvSplit = option.find_first_of( ":" );
        if( kvSplit != string::npos )
        {
          string key = strip( option.substr( 0, kvSplit ) );
          ::transform( key.begin(), key.end(), key.begin(), ::tolower );
          string value = strip( option.substr( kvSplit + 1 ) );
          msg.header[ key ] = value;
        }
      }

      // Parse content
      size_t contentLength;
      ostringstream content;
      if( msg.header.find( "content-length" ) != msg.header.end() )
      {
        contentLength = ::atoi( msg.header[ "content-length" ].c_str() );
        for( uint64_t i = 0; ( i < contentLength ) && stream.rdbuf()->in_avail(); i++ )
          content << char( stream.get() );
      }
      msg.content = content.str();

      if( !OnRequest( msg ) ) break;

    } else {
      aliveTime += cTimeoutTime;
      if( aliveTime > cKeepAliveTime ) break;
    }
  }
}

void 
HTTPInterpreter::HTTPRespond( ostream& stream, int status, Header& hdr, const string& msg )
{
  static string nl = "\r\n";
  
  if( msg.size() && hdr.find( "content-type" ) == hdr.end() )
    hdr[ "content-type" ] = "text/plain";
  if( msg.size() && hdr.find( "content-length" ) == hdr.end() )
    hdr[ "content-length" ] = msg.size();

  stream << "HTTP/1.1 " << status << " " << HTTPStatusCodes[ status ] << nl;
  for( Header::iterator itr = hdr.begin(); itr != hdr.end(); ++itr )
    stream << itr->first << ": " << itr->second << nl;
  stream << nl;

  if( msg.size() ) stream.write( msg.c_str(), msg.size() );
  stream.flush();
}