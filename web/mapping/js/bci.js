// Create a new connection to BCI2000
var bci = new BCI2K.Connection()
bci.connect();

window.onbeforeunload = function() {
	if( bci.connected() ) { bci.resetSystem(); }
}

var config = null;
BCI2K.CreateConfig( function( c ) {

	// For help understanding BCI2000 Operator Module scripting, see:
	// http://www.bci2000.org/wiki/index.php/User_Reference:Operator_Module_Scripting

	// The startupConfig is the only place we can add events and parameters.
	c.startupConfig.pre = function() {
		ret = "Add Event StimulusCode 8 0; ";
		ret += "Add Event KeyDownJS 16 0; ";
		ret += "Add Event KeyUpJS 16 0; ";

		// We add these parameters so that we can have BCI2000 populate them from
		// parameter files, then we query the parameters from BCI2000
		// This way, relevant stimulus information ends up in dat files.
		// These parameters are backward compatible with StimulusPresentationTask
		ret += "Add Parameter Application:Stimuli matrix Stimuli= { caption icon av } { stimulus1 } One images\\1.bmp sounds\\1.wav; ";
		ret += "Add Parameter Application:Sequencing:StimulusPresentationTask intlist Sequence= 1 1; ";
		ret += "Add Parameter Application:Sequencing:StimulusTask float PreRunDuration= 5s 1 0 % // pause preceding first sequence; ";
		ret += "Add Parameter Application:Sequencing:StimulusTask float PostRunDuration= 5s 0 0 % // pause following last sequence; ";
		ret += "Add Parameter Application:Sequencing:StimulusTask float PreSequenceDuration= 5s 2s 0 % // pause preceding sequences/sets of intensifications; ";
		ret += "Add Parameter Application:Sequencing:StimulusTask float PostSequenceDuration= 5s 2s 0 % // pause following sequences/sets of intensifications; ";
		ret += "Add Parameter Application:Sequencing:StimulusTask float StimulusDuration= 1s 40ms 0 % // stimulus duration; ";
		ret += "Add Parameter Application:Sequencing:StimulusTask float ISIMinDuration= 3.5s 80ms 0 % // minimum duration of inter-stimulus interval; ";
		ret += "Add Parameter Application:Sequencing:StimulusTask float ISIMaxDuration= 4.5s 80ms 0 % // maximum duration of inter-stimulus interval; ";
		return ret;
	}

	// Load a standard high gamma signal processing parameter file
	// Also set up trial segmentation
	c.procConfig = new BCI2K.ProcConfig( 'SpectralSignalProcessingMod' );
	c.procConfig.post = function() {
		var ret = "Load Parameterfile ../parms.ecog/SpectralSigProc.prm; ";
		ret += "Set Parameter WSSpectralOutputServer *:20203; ";
		return ret;
	}

	c.appConfig.post = function() {
		var ret = "Set Parameter WSConnectorServer *:20323; ";
		ret += "Set Parameter WSSourceServer *:20100; ";
		return ret;
	}

	config = c;
}, { task: "Mapping_" + query.mode + "_" + query.stim + "_" + query.task }, true );

// Extra configuration occurs here because it depends
// on information from the user interface
function assembleConfigScript( block ) { 
	script = config.script()

	script += "Load Parameterfile " + paradigm.specprm  + "; ";
	script += "Load Parameterfile " + paradigm.seqdir + "/seq" + block + ".prm; ";
	script += "Set Parameter SubjectSession " + ( "00" + block ).slice( -3 ) + "; "; 

	// Let's also initialize the system while we're at it.
	script += "Set Config; Wait For Resting; ";
	return script;
}

var params = null;
( function setupBCI2K() {
	if( config && bci.connected() ) {
		bci.execute( assembleConfigScript( paradigm.block ), function( log ) {
			bci.execute( "List Parameters", function( result ) {
				params = parseParams( result.output );
			} );
		} );
	} else setTimeout( setupBCI2K, 100 );
} )();