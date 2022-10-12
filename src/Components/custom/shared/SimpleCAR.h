////////////////////////////////////////////////////////////////////////////////
// Authors: griffin.milsap@gmail.com
// Description: Performs a stupid-simple CAR operation and has a dead-simple 
//   parameterization.  Technically duplicates functionality present in 
//   SpatialFilter, but makes my life significantly easier.  Also, this filter
//   maintains data type, whereas SpatialFilter converts everything to floating
//   point values, which can lead to strenuous processing down the line.
//
//   BlockCAR puts all channels into different CAR blocks depending on their 
//   channel names.  Specifically, if you follow a naming convention like 
//   [X][#] the channels should fall into their correct blocks.
//   CAR just creates one block containing all channels (except ExcludeChannels)
//
//   In all circumstances, ExcludeChannels is a list of channels that will
//   be placed into their own respective blocks and won't be averaged 
//   into other blocks.
//
//   No matter what:
//     1. The number of channels in == the number of channels out;
//     2. The data type is preserved (int16 in, int16 out)
//     3. Channel names are preserved from input to output
////////////////////////////////////////////////////////////////////////////////

#ifndef INCLUDED_SIMPLECAR_H
#define INCLUDED_SIMPLECAR_H

#include "GenericFilter.h"

class SimpleCAR : public GenericFilter
{
 public:
  SimpleCAR();
  ~SimpleCAR();
  void Publish() override;
  void Preflight( const SignalProperties& Input, SignalProperties& Output ) const override;
  void Initialize( const SignalProperties& Input, const SignalProperties& Output ) override;
  void StartRun() override;
  void Process( const GenericSignal& Input, GenericSignal& Output ) override;
  void StopRun() override;
  void Halt() override;

 private:
  enum Mode {
    Disabled = 0,
    CAR,
    BlockCAR,
	CustomCAR
  };

  int mMode;
  std::map< std::string, std::vector< int > > mBlockMembership; // Maps block names to lists of channel indices

};

#endif // INCLUDED_SIMPLECAR_H
