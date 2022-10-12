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
#ifndef SERIAL_OUTPUT_FILTER_H
#define SERIAL_OUTPUT_FILTER_H

#include "GenericFilter.h"

class serialstream;
class Expression;

class SerialOutputFilter : public GenericFilter
{
 public:
  SerialOutputFilter();
  virtual ~SerialOutputFilter();

  // GenericFilter Interface
  virtual void Halt();
  virtual void Preflight(  const SignalProperties& Input,       SignalProperties& Output ) const;
  virtual void Initialize( const SignalProperties& Input, const SignalProperties& Output );
  virtual void Process(    const GenericSignal&    Input,       GenericSignal&    Output );

 private:
  serialstream* mpSerial;
  Expression* mpOutputExpression;
  std::string mOutputValue;
  bool mPrevValue;
};

#endif // SERIAL_OUTPUT_FILTER_H