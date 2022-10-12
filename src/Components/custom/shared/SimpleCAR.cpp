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

#include "SimpleCAR.h"
#include "BCIStream.h"

using namespace std;

RegisterFilter( SimpleCAR, 2.1 );

SimpleCAR::SimpleCAR()
{

}

SimpleCAR::~SimpleCAR()
{
  Halt();
}

void
SimpleCAR::Publish()
{

 BEGIN_PARAMETER_DEFINITIONS

   "Filtering:SimpleCAR int EnableSimpleCAR= 0 0 0 3 // Enable CAR: 0 Passthrough, 1 CAR, 2 BlockCAR, 3 CustomCAR (enumeration)",
   "Filtering:SimpleCAR stringlist ExcludeChannels= 0 % // List of channels to exclude from CAR blocks",
   "Filtering:SimpleCAR stringlist CARChannels= 0 % // List of channels that will be assigned to blocks in the CARBlocks list",
   "Filtering:SimpleCAR stringlist CARBlocks= 0 % // list of block names, MUST BE SAME LENGTH as CARChannels above"

 END_PARAMETER_DEFINITIONS

}

void
SimpleCAR::Preflight( const SignalProperties& Input, SignalProperties& Output ) const
{
  int enable = Parameter( "EnableSimpleCAR" );
  ParamRef exclude = Parameter( "ExcludeChannels" );
  ParamRef channelList = Parameter( "CARChannels" );
  ParamRef blockList = Parameter( "CARBlocks" );

  switch( enable )
  {
	case BlockCAR:
      if( Input.ChannelLabels().IsTrivial() )
        bciwarn << "Input channel names do not lend themselves to Block CAR; defaulting to CAR";
	case CustomCAR:
		if(enable == CustomCAR && channelList->NumValues() != blockList->NumValues())
			bcierr << "Must have same number of CARBlock labels and CARChannels";
    case CAR:
      for( int exc_idx = 0; exc_idx < exclude->NumValues(); exc_idx++ )
      {
        bool found = false;
        String ch = exclude( exc_idx );
        for( int ch_idx = 0; ch_idx < Input.ChannelLabels().Size(); ch_idx++ )
          if( Input.ChannelLabels()[ ch_idx ] == ch )
            found = true;
        if( !found ) bciwarn << "Could not find " << ch << " as an input channel; not excluding";
      }
    case Disabled:
    default:
      break;
  }

  Output = Input;
}


void
SimpleCAR::Initialize( const SignalProperties& Input, const SignalProperties& Output )
{
  mMode = ( int )Parameter( "EnableSimpleCAR" );

  if( mMode ) {
    mBlockMembership.clear();

    // Populate exclude channels
    vector< string > exclude;
    for( int exc_idx = 0; exc_idx < Parameter( "ExcludeChannels" )->NumValues(); exc_idx++ )
      exclude.push_back( ( string )Parameter( "ExcludeChannels" )( exc_idx ) );

	// populate parallel lists of CARChannels and CARBlocks
	map< string, string > CARBlockMapping;
	for( int idx = 0; idx < Parameter( "CARChannels" )->NumValues(); idx++ )
		CARBlockMapping[ ( string )Parameter( "CARChannels" )( idx ) ] = ( string )Parameter( "CARBlocks" )( idx );

    // Populate block memberships
    for( int ch_idx = 0; ch_idx < Input.ChannelLabels().Size(); ch_idx++ )
    {
      string ch = Input.ChannelLabels()[ ch_idx ];
      size_t sep = ch.find_first_of( "1234567890" );
      if( ( ( mMode == BlockCAR ) && ( sep == string::npos ) ) || ::find( exclude.begin(), exclude.end(), ch ) != exclude.end() ) 
			; // do nothing.  old call set up individual car blocks for each channel: mBlockMembership[ ch ].push_back( ch_idx )
      else if (mMode == BlockCAR)
		  mBlockMembership[ ch.substr( 0, sep ) ].push_back( ch_idx );
	  else if (mMode == CAR)
		  mBlockMembership[ "Common" ].push_back( ch_idx );
	  else if (mMode == CustomCAR && CARBlockMapping.find(ch) != CARBlockMapping.end())
		  mBlockMembership[ CARBlockMapping[ ch ] ].push_back( ch_idx );
    }
  }
}

void
SimpleCAR::StartRun()
{

}

void
SimpleCAR::Process( const GenericSignal& Input, GenericSignal& Output )
{
  
  // default = passthrough.  Importantly, things not in a CAR block are unchanged
  Output = Input;

  // if there are CAR things to be done
  if( mMode )
  {
	
    for( map< string, vector< int > >::iterator block_itr = mBlockMembership.begin(); block_itr != mBlockMembership.end(); block_itr++ )
    {
      for( int el = 0; el < Input.Elements(); el++ )
      {
        // Calculate average value for this element across the block
        float avg = 0.0;
        for( vector< int >::iterator ch_itr = block_itr->second.begin(); ch_itr != block_itr->second.end(); ch_itr++ )
          avg += Input( *ch_itr, el );
        avg /= float( block_itr->second.size() );

        // Calculate output by subtracting block average
        for( vector< int >::iterator ch_itr = block_itr->second.begin(); ch_itr != block_itr->second.end(); ch_itr++ )
          Output( *ch_itr, el ) = Input( *ch_itr, el ) - avg;
      }
    }
  }
}

void
SimpleCAR::StopRun()
{

}

void
SimpleCAR::Halt()
{

}

