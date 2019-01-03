var bci = new BCI2K.Connection();

$( document ).ready( function() {
	// bci.onconnect = function() {
	// 	// getReplayFiles(); // src/replay.js
	// 	monitorSystemState();
	// }
	bci.connect();

} );

var systemState = null;
function monitorSystemState() {
	bci.execute( 'Get System State', function( result ) {
		var newState = $.trim( result.output );
		if( newState != systemState ) {
			systemState = newState;
			onSystemStateChange( systemState );
		}
	} );
	setTimeout( monitorSystemState, 1000 );
}

var subject = null;
function onSystemStateChange( state )
{
	var status_html = 'Replay Dashboard: ' + state + ' ';
	$( '#tmp' ).text( "" ); $( "#data" ).html( "" );
	if( state != 'Idle' ) status_html += '<a onclick="bci.resetSystem()">(Reset System)</a>';

	if( state == 'Running' ) {
		bci.execute( "Get Parameter SubjectName", function( result ) { 
			subject = $.trim( result.output );
		} );
	}
	$( '#statusTitle' ).html( status_html );
}