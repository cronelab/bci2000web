////////////////////////////////////////////////////////////////////////////////
// $Id: PipeDefinition.cpp 3833 2012-02-29 16:13:10Z mellinger $
// Description: This file defines which filters will be used, and the sequence
//   in which they are applied.
//   Each Filter() entry consists of the name of the filter and a string which,
//   by lexical comparison, defines the relative position of the filter in the
//   sequence.
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

#include "SimpleCAR.h"
#include "SpectralEstimator.h"
#include "LinearClassifier.h"
#include "IIRBandpass.h"
#include "LPFilter.h"
#include "ExpressionFilter.h"
#include "Normalizer.h"
#include "WSIOFilter.h"

Filter( SimpleCAR, 2.B );
Filter( IIRBandpass, 2.B2 );
Filter( SpectralEstimator, 2.C );

class WSSpectralOutputFilter : public WSIOFilter 
{
  public: WSSpectralOutputFilter() : 
    WSIOFilter( "Filtering:SpectralOutput", "SpectralOutput", 20203 ) { }
}; Filter( WSSpectralOutputFilter, 2.C1 );

Filter( LinearClassifier, 2.D );
//Filter( LPFilter, 2.D1 );
//Filter( ExpressionFilter, 2.D2 );
//Filter( Normalizer, 2.E );
