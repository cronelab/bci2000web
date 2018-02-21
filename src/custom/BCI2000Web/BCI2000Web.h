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
#ifndef BCI2000WEB_H
#define BCI2000WEB_H

#include "QtSignalConnector.h"
#include "HTTPServer.h"
#include "Thread.h"

#include <string>

#include <QSystemTrayIcon>
#include <QDialog>

class QMenu;
class QIcon;

class BCI2000Web : public QDialog, public HTTPServer, public QtSignalConnector
{
 public:
  BCI2000Web( const std::string&, const std::string& );

  void AdditionalArgs( const std::string &args ) { mAdditionalArgs = args; }
  void StartWebService() { if( !mPoller.Result() ) mPoller.Start(); }
  void StopWebService() { mPoller.TerminateAndWait(); }

 protected:
  virtual void OnQuitAction();
  virtual void OnShowLog() { Execute( "Show Window Log", NULL ); }
  virtual void OnResetSystem() { Execute( "Reset System", NULL ); }
  virtual void OnRestartOperator() { Execute( "Quit", NULL ); Reconnect(); }
  virtual void OnShowWindow() { Execute( "Show Window", NULL ); }
  virtual void OnHideWindow() { Execute( "Hide Window", NULL ); }
  virtual void OnIconActivated();

 private:

  int Reconnect();

  class ConnectionPoller : private Thread
  {
   public:
    explicit ConnectionPoller( BCI2000Web* conn ) :
      mpConnection( conn ) { }

    int OnExecute()
    {
      while( mpConnection->Connected() && !Terminating() )
        ThreadUtils::SleepFor( Time::FromIntTimeout( 100 ) );
      return Terminating() ? 1 : mpConnection->Reconnect();
    }
 
   private:
    friend class BCI2000Web;
    BCI2000Web* mpConnection;
  } mPoller;

  std::string mAdditionalArgs;
  bool mOperatorVisible;

  QSystemTrayIcon* mpTrayIcon;
  QMenu* mpTrayMenu;
  QIcon* mpIcon;
};

#endif // BCI2000WEB_H