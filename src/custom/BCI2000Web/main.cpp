////////////////////////////////////////////////////////////////////
// $Id: main.cpp 4731 2014-07-03 15:18:03Z mellinger $
// Author: juergen.mellinger@uni-tuebingen.de
// Description: A script shell that may be used to start up and
//   control BCI2000.
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
#include "QtMain.h"
#include "BCI2000Web.h"
#include "EnvVariable.h"
#include "FileUtils.h"
#include "ProcessUtils.h"

#include <string>

using namespace std;

static const string sShebang = "#!";
int main( int argc, char** argv )
{
  ProcessUtils::InitializeDesktopIntegration( "org.bci2000.OnlineModules" );
  if( !ProcessUtils::AssertSingleInstance( argc, argv ) )
    return 0;

  QtApplication app( argc, argv );

  string additionalArgs,
         telnetAddress;

  string webRoot = "../";
  string httpServer = "*:80";

  EnvVariable::Get( "BCI2000TelnetAddress", telnetAddress );
  int idx = 1;
  while( idx < argc && argv[idx] != sShebang )
  {
    if( !::stricmp( argv[idx], "--Telnet" ) && idx + 1 < argc )
      telnetAddress = argv[++idx];
    else if( !::stricmp( argv[idx], "--HTTP" ) && idx + 1 < argc )
      httpServer = argv[++idx];
    else if( !::stricmp( argv[idx], "--WebRoot" ) && idx + 1 < argc )
      webRoot = argv[++idx];
    else
    {
      string arg = argv[idx];
      additionalArgs += " ";
      additionalArgs += arg;
    }
    idx++;
  }

  BCI2000Web web( httpServer, webRoot );
  
  // Assumes Operator is in the same directory
  web.OperatorPath( "" );
  web.TelnetAddress( telnetAddress );
  web.AdditionalArgs( additionalArgs );
  web.StartWebService();

  return app.Run();
}
