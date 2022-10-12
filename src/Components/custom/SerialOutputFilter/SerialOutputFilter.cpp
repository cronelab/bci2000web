////////////////////////////////////////////////////////////////////////////////
// $Id: $
// Author: griffin.milsap@gmail.com
// Description: A filter that sends serial commands triggered by expressions.
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
#include "PCHIncludes.h"
#pragma hdrstop

#include "SerialOutputFilter.h"
#include "SerialStream.h"
#include "Expression.h"

using namespace std;

RegisterFilter( SerialOutputFilter, 3.1 );

SerialOutputFilter::SerialOutputFilter() :
  mpSerial( NULL ),
  mpOutputExpression( NULL )
{
 BEGIN_PARAMETER_DEFINITIONS
  "Application:SerialOutput string SerialOutputPort= % "
    "% % % // Serial Port to use for output",

  "Application:SerialOutput string SerialOutputExpression= % "
    "% % % // Output will occur when this expression evaluates from false to true",

  "Application:SerialOutput string SerialOutputValue= % "
    "% % % // Value to send on serial output",
 END_PARAMETER_DEFINITIONS
}

SerialOutputFilter::~SerialOutputFilter()
{

}

void
SerialOutputFilter::Preflight( const SignalProperties& Input, SignalProperties& Output ) const
{
  // Make sure we can open the serial port of interest;
  if( string( Parameter( "SerialOutputPort" ) ) != "" )
  {
    serialstream testSerial( string( Parameter( "SerialOutputPort" ) ).c_str() );
    if( !testSerial.is_open() )
      bcierr << "Couldn't open serial output on " << Parameter( "SerialOutputPort" );
    testSerial.close();
  }

  // Make sure the expression we were provided is valid
  GenericSignal preflightSignal = GenericSignal( Output ); 
  if( string( Parameter( "SerialOutputExpression" ) ) != "" )
  {
    Expression testExp( string( Parameter( "SerialOutputExpression" ) ) ); 
    testExp.Evaluate( &preflightSignal );
  }

  string outValue = Parameter( "SerialOutputValue" );
  Output = Input;
}

void
SerialOutputFilter::Initialize( const SignalProperties& Input, const SignalProperties& Output )
{
  mpSerial = new serialstream( string( Parameter( "SerialOutputPort" ) ).c_str() );
  mpOutputExpression = new Expression( string( Parameter( "SerialOutputExpression" ) ) );
  mOutputValue = Parameter( "SerialOutputValue" );
  mPrevValue = false;
}

void 
SerialOutputFilter::Process( const GenericSignal& Input, GenericSignal& Output )
{
  // Evaluate the current value of the expression
  bool curExpValue = mpOutputExpression->Evaluate( &Input );

  // If it isn't what it was before, and it's currently "true", perform serial output
  if( curExpValue != mPrevValue && curExpValue ) {
    for( size_t i = 0; i < mOutputValue.size(); i++ )
      mpSerial->put( mOutputValue[i] );
  }
  mpSerial->flush();

  mPrevValue = curExpValue;
  Output = Input;
}

void
SerialOutputFilter::Halt()
{
  // Close down previous serial port
  if( mpSerial && mpSerial->is_open() )
    mpSerial->close();
  delete mpSerial;
  mpSerial = NULL;

  // Delete the expression object
  delete mpOutputExpression;
  mpOutputExpression = NULL;
}


