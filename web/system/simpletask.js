var bci = new BCI2K.Connection();
bci.connect();


var trialConnection = null;
( function applyConfig() {
	if( bci.connected() && config ) {
		bci.execute( config.script(), function( result ) { 

			bci.tap( "SpectralOutput", function( dataConnection ) {
				trialConnection = dataConnection;
				trialConnection.onStateVector = onStateVector;
				setTimeout( updateState, 500 );
				setTimeout( getNumTrials, 400 );
			} );

			bci.execute( "Set Config; Wait for Resting; Start" )
			
		} );
	} else setTimeout( applyConfig, 100 );
} )();

window.onbeforeunload = function() {
	if( bci.connected() ) {
		bci.resetSystem();
	}
}

var trials = 0;
var curCode = null;
function onStateVector( states ) {
	// Detect changes in StimulusCode
	if( states.hasOwnProperty( "StimulusCode " ) && states.StimulusCode[0] != curCode ) {
		curCode = states.StimulusCode[0];
		if( curCode ) {
			trials++;
			requestAnimationFrame( draw );
		}
	}
}

var canvas = document.getElementById( 'stim' );
var context = canvas.getContext( '2d' );

window.addEventListener( 'resize', resize, false );
function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	requestAnimationFrame( draw );
}

resize();

function draw( time ) {
	context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
	var cx = canvas.width / 2.0;
	var cy = canvas.height / 2.0;

	context.textAlign = "center";
	context.textBaseline = "middle";
	context.font = "62px arial";
	context.fillStyle = "white";
	context.fillText( document.title, cx, cy - 200 );
	context.font = "48px arial";
	if( state.search( "Suspended" ) >= 0 )
		context.fillText( 'Click "Back" to Finish Paradigm', cx, cy + 50 );
	else {
		if( trials == 0 ) context.fillText( "Running...", cx, cy + 50 );
		else context.fillText( 'Trials: ' + trials.toString(), cx, cy + 50 );
	}
}

var state = "Loading...";
function updateState() {
	bci.execute( "Get System State", function( result ) {
		state = result.output;
	} );
	setTimeout( updateState, 1000 );
	requestAnimationFrame( draw );
}

// There's a bug here...
var totalTrials = "?";
function getNumTrials() {
// 	bci.execute( "Get Parameter Sequence", function( result ) {
// 		//totalTrials = result.output.split( " " ).length.toString();
// 	} );
}