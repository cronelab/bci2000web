////////////////////////////////////////////////////////////////////
// $Id: $
// Author: griffin.milsap@gmail.com
// Description: A BCI2000 Webapp Server
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
////////////////////////////////////////////////////////////////////
#include "BCI2000Web.h"

#include <iostream>
#include <cstring>

#include "BCI2000Connection.h"
#include "FileUtils.h"
#include "Runnable.h"
#include "Resources.h"

#include <QCoreApplication>
#include <QAction>
#include <QMenu>
#include <QIcon>
#include <QPixmap>

#if _WIN32
# include <Windows.h>
#endif

using namespace std;

#if _WIN32
static const char* sOperatorName = "Operator.exe";
#else
static const char* sOperatorName = "Operator";
#endif

BCI2000Web::BCI2000Web( const string& inAddress, const string& webRoot ) :
  HTTPServer( inAddress, webRoot ),
  mPoller( this ),
  mOperatorVisible( false )
{
  mPoller.Notify( WhenFinished, new MemberCall< void( BCI2000Web* ) >( &BCI2000Web::StartWebService, this ) );

  mpTrayMenu = new QMenu( this );

  QAction* pShowLogAction = new QAction( tr( "Show &Log" ), this );
  QtSignalConnector::Connect( pShowLogAction, SIGNAL( triggered() ),
    MemberCall< void( BCI2000Web* ) >( &BCI2000Web::OnShowLog, this ) );
  mpTrayMenu->addAction( pShowLogAction );

  QAction* pResetSystemAction = new QAction( tr( "&Reset System" ), this );
  QtSignalConnector::Connect( pResetSystemAction, SIGNAL( triggered() ),
    MemberCall< void( BCI2000Web* ) >( &BCI2000Web::OnResetSystem, this ) );
  mpTrayMenu->addAction( pResetSystemAction );

  QAction* pRestartOperatorAction = new QAction( tr( "Restart Operator" ), this );
  QtSignalConnector::Connect( pRestartOperatorAction, SIGNAL( triggered() ),
    MemberCall< void( BCI2000Web* ) >( &BCI2000Web::OnRestartOperator, this ) );
  mpTrayMenu->addAction( pRestartOperatorAction );

  QAction* pShowWindowAction = new QAction( tr( "&Show Window" ), this );
  QtSignalConnector::Connect( pShowWindowAction, SIGNAL( triggered() ),
    MemberCall< void( BCI2000Web* ) >( &BCI2000Web::OnShowWindow, this ) );
  mpTrayMenu->addAction( pShowWindowAction );

  QAction* pHideWindowAction = new QAction( tr( "&Hide Window" ), this );
  QtSignalConnector::Connect( pHideWindowAction, SIGNAL( triggered() ),
    MemberCall< void( BCI2000Web* ) >( &BCI2000Web::OnHideWindow, this ) );
  mpTrayMenu->addAction( pHideWindowAction );

  mpTrayMenu->addSeparator();

  QAction* pQuitAction = new QAction( tr( "&Quit" ), this );
  QtSignalConnector::Connect( pQuitAction, SIGNAL( triggered() ), 
    MemberCall< void( BCI2000Web* ) >( &BCI2000Web::OnQuitAction, this ) );
  mpTrayMenu->addAction( pQuitAction );

  mpTrayIcon = new QSystemTrayIcon( this );
  mpTrayIcon->setContextMenu( mpTrayMenu );
  mpTrayIcon->setToolTip( QString::fromLocal8Bit( FileUtils::ApplicationTitle().c_str() ) );

#if _WIN32
  mpIcon = new QIcon();
  QPixmap img;

  HRSRC h = ::FindResourceA( 0, MAKEINTRESOURCE(1), RT_GROUP_ICON );
  HGLOBAL h2 = h ? ::LoadResource( 0, h ) : 0;
  void* pIcons = h2 ? ::LockResource( h2 ) : nullptr;
  if( pIcons )
  {
    int id = ::LookupIconIdFromDirectoryEx( static_cast<BYTE*>( pIcons ), TRUE, 256, 256, LR_DEFAULTCOLOR );
    if( id )
    {
      HRSRC h = ::FindResourceA( 0, MAKEINTRESOURCE(id), RT_ICON );
      HGLOBAL h2 = h ? ::LoadResource( 0, h ) : 0;
      void* pIcon = h2 ? ::LockResource( h2 ) : nullptr;
      if( pIcon && img.loadFromData( static_cast<const uchar*>( pIcon ), ::SizeofResource( 0, h ) ) )
        mpIcon->addPixmap( img.scaledToWidth( 256, Qt::SmoothTransformation ) );
    }
  }

  mpTrayIcon->setIcon( *mpIcon );
  mpTrayIcon->setVisible( true );
#endif // _WIN32

}

void
BCI2000Web::OnIconActivated()
{
  Execute( mOperatorVisible ? "Hide Window" : "Show Window", NULL );
  mOperatorVisible = !mOperatorVisible;
}

int
BCI2000Web::Reconnect()
{
  ThreadUtils::SleepFor( Time::FromIntTimeout( 1000 ) );

  QString appTitle = QString::fromLocal8Bit( FileUtils::ApplicationTitle().c_str() );
  bool alreadyRunning = BCI2000Connection::Connect();

  if( !alreadyRunning )
  {
    if( !Run( FileUtils::InstallationDirectory() + sOperatorName, mAdditionalArgs )
        || !BCI2000Connection::Connect() )
    {
      mpTrayIcon->showMessage( appTitle, tr( "Could not connect to Operator..." ), 
        QSystemTrayIcon::Critical );
      return -1;
    }
  }

  Execute( "cd \"" + FileUtils::WorkingDirectory() + "\"", 0 );
  Log( "Connected to Operator!" );
  mpTrayIcon->showMessage( appTitle, tr( "Connected to Operator!" ) );

  return 0;
}

void
BCI2000Web::OnQuitAction()
{
  StopWebService();
  QCoreApplication::quit();
}


