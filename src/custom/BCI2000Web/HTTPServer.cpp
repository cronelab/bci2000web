////////////////////////////////////////////////////////////////////////////////
// $Id: $
// Authors: griffin.milsap@gmail.com
// Description: A simple HTTP server that runs inside a BCI2000
//   operator module.  Supports Websocket upgrade and is capable
//   of executing scripts
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
#include "HTTPServer.h"

#include "BCI2000Connection.h"
#include "BCIException.h"
#include "Streambuf.h"
#include "FileUtils.h"

#include "HTTPInterpreter.h"
#include "WebSocketInterpreter.h"

#include <QMimeDatabase>
#include <QUrl>
#include <QDir>

#include <string>
#include <iostream>

#ifndef _WIN32
#include <unistd.h>
#endif // _WIN32

using namespace std;

class HTTPServer::Session : private Thread, private HTTPInterpreter, private WebSocketInterpreter
{
 public:
  Session( HTTPServer* parent );

  // Thread interface
  int OnExecute();

  // HTTPInterpreter interface
  bool OnRequest( const HTTPMessage& );
  void Debug( const string& msg );

  // WebSocketInterpreter interface
  void OnConnect();
  void OnTextMessage( const string& );

  void WriteToWebSocket( const string& );
  void AbortAndWait();

  enum MessageType
  {
    Execute = 'E', // Command to execute from client to server
    Start = 'S', // Message from server to client that execution is starting
    Output = 'O', // Output from server to client during execution
    Input = 'I', // Server awaiting input from client
    Response = 'R', // Response from client to server
    Done = 'D', // Server notifying client that execution has finished
  };

 private:
  ~Session();
  Synchronized<HTTPServer*> mpParent;
  TCPSocket mSocket;
  BufferedIO mBuffer;
  std::iostream mStream;
  uint32_t mExecID;

  friend class HTTPInterpreter;
  friend class WebSocketInterpreter;
};

// HTTPServer
HTTPServer::HTTPServer( const string& inAddress, const string& webRoot ) :
  mWebRoot( webRoot )
{
  mListeningSocket.SetTCPNodelay( true );
  mListeningSocket.Open( inAddress );
  if( !mListeningSocket.IsOpen() )
    throw bciexception << "HTTPServer: Cannot listen at " << inAddress;
  Thread::Start();
  Log( "Listening on " + inAddress );
}

HTTPServer::~HTTPServer()
{
  mListeningSocket.Close();
  list<Session*> s;
  WithLock( mSessions )
    s = mSessions;
  for( list<Session*>::iterator i = s.begin(); i != s.end(); ++i )
    (*i)->AbortAndWait();
  Thread::TerminateAndWait();
  Log( "Shutting down" );
}

int
HTTPServer::OnExecute()
{
  while( mListeningSocket.Wait() )
    new Session( this );
  return 0;
}

bool
HTTPServer::OnInput( string& in )
{
  // Blocking input not implemented yet
  return false;
}

bool
HTTPServer::OnOutput( const string& out )
{
  WithLock( mSessions )
    for( list<Session*>::iterator itr = mSessions.begin(); itr != mSessions.end(); ++itr )
      ( *itr )->WriteToWebSocket( out );
  return true;
}

HTTPServer::Session::Session( HTTPServer* pParent )
: Thread( true ),
  mpParent( pParent ),
  mStream( &mBuffer ),
  mExecID( 0 )
{
  mSocket.SetBlockingMode( false );
  mBuffer.SetIO( &mSocket );
  WithLock( mpParent->mSessions ) { 
    mpParent->mSessions.push_back( this );
    mpParent->mListeningSocket.WaitForAccept( mSocket, 0 );
  }
  Thread::Start();
}

HTTPServer::Session::~Session()
{
  WithLock( mpParent->mSessions )
    mpParent->mSessions.remove( this );
}

void
HTTPServer::Session::AbortAndWait()
{
  Thread::TerminateAndWait();
}

int
HTTPServer::Session::OnExecute()
{
  HTTPInterpreter::HTTPListen( this, mSocket, mStream );
  return 0;
}

bool
HTTPServer::Session::OnRequest( const HTTPInterpreter::HTTPMessage& msg )
{
  if( msg.command == "GET" )
  {
    Header::const_iterator upgrade = msg.header.find( "upgrade" );
    Header::const_iterator host = msg.header.find( "host" );

    // All requests MUST have host (RFC2616)
    if( host == msg.header.end() )
    {
      HTTPRespond( mStream, 400 );
      return false;
    }

    if( upgrade != msg.header.end() && (
        upgrade->second.find( "websocket" ) != string::npos || 
        upgrade->second.find( "WebSocket" ) != string::npos 
    ) )
    {
      // Upgrade connection to websocket protocol
      mpParent->Log( "Upgrading " + mSocket.Address() + " to Websocket Connection" );
      Header::const_iterator key = msg.header.find( "sec-websocket-key" );
      if( key == msg.header.end() ) return false;

      WebSocketInterpreter::Listen( this, mSocket, mStream, key->second );
      mpParent->Log( "Terminated Websocket Connection to " + mSocket.Address() );

      // Kill session after websocket
      return false;

    } else {

      // Parse requested resource
      QUrl url( QString::fromStdString( msg.resource ) );
      if( QDir::isRelativePath( url.path() ) ) 
      {
        // We don't allow relative path requests
        HTTPRespond( mStream, 403 );
        return false;
      }

      // Fuuuuuuuck this shit
      QString urlPath = url.path();
      urlPath.prepend( '.' );
      QDir webRoot( QString::fromStdString( FileUtils::AbsolutePath( mpParent->mWebRoot ) ) );
      if( FileUtils::IsDirectory( webRoot.filePath( urlPath ).toStdString() ) )
      {
        // Issue Redirect
        Header redirect;
        url.setPath( QDir( url.path() ).filePath( "index.html" ) );
        redirect[ "location" ] = url.toString().toStdString();
        HTTPRespond( mStream, 301, redirect );
        return false;
      }

      string path = webRoot.filePath( urlPath ).toStdString();

      // Serve requested resource
      if( FileUtils::Exists( path ) )
      {
        mpParent->Log( " GET -- Serving " + path + " to " + mSocket.Address() );

        QMimeDatabase db;
        QMimeType type = db.mimeTypeForFile( path.c_str() );
        string contentType = type.name().toStdString();
        ifstream file( path.c_str(), ios::binary );
        file.seekg( 0, ios::end );
        size_t length = file.tellg();
        file.seekg( 0, ios::beg );

        char* data = new char[ length ];
        file.read( data, length );
        string respMsg( data, length );
        delete [] data;
        file.close();

        Header respHdr;
        respHdr[ "content-type" ] = contentType;
        ostringstream oss;
        oss << respMsg.size();
        respHdr[ "content-length" ] = oss.str();

        HTTPRespond( mStream, 200, respHdr, respMsg );
      } else {
        mpParent->Warn( "GET -- 404 - " + mSocket.Address() +
          " requested non existent resource " + path );
        HTTPRespond( mStream, 404 );
        return false;
      }
    }

    // Keep session alive after GET
    return true;
  } else { 
    // This server only supports GET requests currently
    HTTPRespond( mStream, 500 );
    return false;
  }

  // Should never get here, something bad happened
  HTTPRespond( mStream, 500 );
  return false;
}

void
HTTPServer::Session::Debug( const string& msg )
{
  mpParent->Log( msg );
}

void
HTTPServer::Session::OnConnect()
{
  
}

void
HTTPServer::Session::OnTextMessage( const string& data )
{
  istringstream iss( data );
  switch( iss.get() )
  {
    case MessageType::Execute:
      WithLock( mpParent->mExecuteLock )
      {
        iss >> mExecID;

        ostringstream oss_start;
        oss_start << char( Start ) << " " << mExecID;
        WriteMessage( mStream, Text, oss_start.str() );

        int returnCode = 0;
        size_t end_op = data.find_first_of( " " );
        size_t end_id = data.find_first_of( " ", end_op + 1 );
        mpParent->BCI2000Connection::Execute( data.substr( end_id + 1 ), &returnCode );

        ostringstream oss_done;
        oss_done << char( Done ) << " " << mExecID << " " << returnCode;
        WriteMessage( mStream, Text, oss_done.str() );

        mExecID = 0;
      }
      break;
    case MessageType::Response: // Not impl. yet
    default:
      break;
  }
}

void
HTTPServer::Session::WriteToWebSocket( const std::string& msg )
{
  if( Connected() && mExecID ) {
    ostringstream oss;
    oss << char( Output ) << " " << mExecID << " " << msg;
    WriteMessage( mStream, Text, oss.str() );
  }
}