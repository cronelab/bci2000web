
window.addEventListener( 'load', init, false );
function init() {
	setupAudio();
}

var audioContext = null;
function setupAudio() {
	try {
		window.AudioContext = window.AudioContext || 
			window.webkitAudioContext ||
			window.mozAudioContext ||
			window.oAudioContext ||
			window.msAudioContext;
		audioContext = new AudioContext();	
	} catch( e ) {
		alert( 'Audio API not supported in this browser, Use Chrome?' );
	}
}

var timing = null;
( function loadTimings() {
	if( params ) {
		timing = {
			PreRunDuration: toms( parseNum( params.PreRunDuration ) ),
			PostRunDuration: toms( parseNum( params.PostRunDuration ) ),
			PreSequenceDuration: toms( parseNum( params.PreSequenceDuration ) ),
			PostSequenceDuration: toms( parseNum( params.PostSequenceDuration ) ),
			StimulusDuration: toms( parseNum( params.StimulusDuration ) ),
			ISIMinDuration: toms( parseNum( params.ISIMinDuration ) ),
			ISIMaxDuration: toms( parseNum( params.ISIMaxDuration ) ),
		}
	} else setTimeout( loadTimings, 200 );
} )();

var audioLoaded = false;
var iconsLoaded = false;
var stimuli = null;
var sequences = null;
( function loadStimuli() {

	if( params && audioContext ) {
		var stimmat = parseMatrix( params.Stimuli );
		sequences = [ parseIntList( params.Sequence ) ];
		var audioRow = stimmat.rows.indexOf( 'audio' );
		if( audioRow < 0 ) audioRow = stimmat.rows.indexOf( 'av' );
		var iconRow = stimmat.rows.indexOf( 'icon' );
		var captionRow = stimmat.rows.indexOf( 'caption' );
		var stimulusDurationRow = stimmat.rows.indexOf( 'StimulusDuration' );

		
		stimuli = [];
		for( var i = 0; i < stimmat.cols.length; i++ ) {
			var stim = { caption: stimmat.mat[ captionRow ][ i ] }
			
			if( stimulusDurationRow >= 0 )
				stim.stimulusDuration = toms( stimmat.mat[ stimulusDurationRow ][ i ] );
			stimuli.push( stim );
		}

		for( var i = 0; i < stimmat.mat[ audioRow ].length; i++ )
			if( stimmat.mat[ audioRow ][i] != "" )
				stimmat.mat[ audioRow ][i] = "/prog/" + stimmat.mat[ audioRow ][i];
		for( var i = 0; i < stimmat.mat[ iconRow ].length; i++ )
			if( stimmat.mat[ iconRow ][i] != "" )
				stimmat.mat[ iconRow ][i] = "/prog/" + stimmat.mat[ iconRow ][i];

		var bufferLoader = new BufferLoader( audioContext, 
			stimmat.mat[ audioRow ],
			function( bufferlist ) {
				for( var i = 0; i < bufferlist.length; i++ )
					stimuli[i].audio = bufferlist[ i ];
				audioLoaded = true;
				requestAnimationFrame( draw );
			} 
		);

		bufferLoader.load();

		var imageLoader = new ImageLoader( 
			stimmat.mat[ iconRow ],
			function( imagelist ) {
				for( var i = 0; i < imagelist.length; i++ )
					stimuli[i].icon = imagelist[ i ];
				iconsLoaded = true;
				requestAnimationFrame( draw );
			}
		);

		imageLoader.load();

	} else setTimeout( loadStimuli, 200 );

} )();

// Request fullscreen for the canvas
// This is super verbose so that it works on all browsers.
// Web development isn't always the prettiest...
var canvas = document.getElementById( 'stim' );
function requestFullscreen() {
	// Set onFullscreenChange to be called once the canvas goes fullscreen.
	document.addEventListener( 'webkitfullscreenchange', onFullscreenChange );
	document.addEventListener( 'mozfullscreenchange', onFullscreenChange );
	document.addEventListener( 'fullscreenchange', onFullscreenChange );
	document.addEventListener( 'MSFullscreenChange', onFullscreenChange );

	// Actually request fullscreen priviliges for the canvas
	if( canvas.requestFullscreen ) canvas.requestFullscreen();
	else if( canvas.msRequestFullscreen ) canvas.msRequestFullscreen();
	else if( canvas.mozRequestFullScreen ) canvas.mozRequestFullScreen();
	else if( canvas.webkitRequestFullscreen ) canvas.webkitRequestFullscreen();
}

function exitFullscreen() {
	if( document.exitFullscreen ) document.exitFullscreen();
	else if( document.msExitFullscreen ) document.msExitFullscreen();
	else if( document.mozCancelFullScreen ) document.mozCancelFullScreen();
	else if( document.webkitExitFullscreen ) document.webkitExitFullscreen();
	requestAnimationFrame( draw );
}

function isFullscreen() { // Really dumb but compatible
	return document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement;
}

function onFullscreenChange() {
	if( isFullscreen() )
		startParadigm();
	else endParadigm();
}

var timeout = null;
function startParadigm() {
	bci.start();
	prerun();
}

function prerun() {
	timeout = setTimeout( presequence, timing.PreRunDuration );
}

function presequence() {
	timeout = setTimeout( showstim, timing.PreSequenceDuration ); 
}

var stimVisible = false;
var curStim = 0;
var curSequence = 0;
function showstim() {
	if( curStim == sequences[ curSequence ].length )
		postsequence();
	else {
		var stim = stimuli[ sequences[ curSequence ][ curStim ] - 1 ];
		if( stim.icon || stim.caption )
			stimVisible = true;

		if( stim.audio && query.mode == "Auditory" ) {
			// Play audio stimulus
			var source = audioContext.createBufferSource();
			source.buffer = stim.audio;
			source.connect( audioContext.destination );
			source.start( 0 );
		}
		
		bci.execute( "Set Event StimulusCode " + ( sequences[ curSequence ][ curStim ] ).toString() );
		requestAnimationFrame( draw );
		var duration = timing.StimulusDuration;
		if( stim.stimulusDuration ) duration = stim.stimulusDuration;
		timeout = setTimeout( isi, duration );
	}
}

function isi() {
	bci.execute( "Set Event StimulusCode 0" );
	stimVisible = false;
	curStim++;
	requestAnimationFrame( draw );
	var range = timing.ISIMaxDuration - timing.ISIMinDuration;
	var isilen = timing.ISIMinDuration + ( range * Math.random() );
	timeout = setTimeout( showstim, isilen );
}

function postsequence() {
	var next = presequence;
	if( ++curSequence == sequences.length ) next = postrun;
	timeout = setTimeout( next, timing.PostSequenceDuration );
}

function postrun() {
	timeout = setTimeout( endParadigm, timing.PostRunDuration );
}

function endParadigm() {
	bci.stop();
	clearTimeout( timeout );
	exitFullscreen();
}

// STIMULUS PRESENTATION

// When the page changes size, we need to redraw the canvas
window.addEventListener( 'resize', resize, false );
function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	requestAnimationFrame( draw );
}; resize();

// Any time we request a redraw of the canvas, this function is called
// The idea is that there are global state variables that are changed
// by schedulers and those variables are enabling and disabling 
// bits of the draw code.

var stimfont = "bold 4em arial";
var context = canvas.getContext( '2d' );

function getTextHeight( font ) {

	var text = $( '<span>Hg</span>' ).css( { fontFamily: font } );
	var block = $( '<div style="display: inline-block; width: 1px; height: 0px;"></div>' );

	var div = $( '<div></div>' );
	div.append(text, block);

	var body = $( 'body' );
	body.append(div);

	try {

		var result = {};

		block.css( { verticalAlign: 'baseline' } );
		result.ascent = block.offset().top - text.offset().top;

		block.css( { verticalAlign: 'bottom' } );
		result.height = block.offset().top - text.offset().top;

		result.descent = result.height - result.ascent;

	} finally {
		div.remove();
	}

	return result;
};

var fontmetrics = getTextHeight( stimfont );
var fontheight = fontmetrics.height + fontmetrics.descent;

function draw() {

	// Draw Background
	context.fillStyle = "black";
	context.fillRect( 0, 0, canvas.width, canvas.height );
	
	// Find the center of the screen
	var width = canvas.width;
	var height = canvas.height;
	var cx = width / 2.0;
	var cy = height / 2.0;

	// Draw Category Text 
	context.font = stimfont;
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = "white";

	if( !iconsLoaded || !audioLoaded )
		context.fillText( "Loading...", cx, cy );
	else if( !isFullscreen() )
		context.fillText( "Start", cx, cy );
	else {
		if( stimVisible && query.mode == "Visual" ) {
			var stim = stimuli[ sequences[ curSequence ][ curStim ] - 1 ];
			if( stim.caption )
				wrapText( context, stim.caption, cx, cy, width * 0.9, fontheight * 3 );
			if( stim.icon )
				context.drawImage( stim.icon, cx, cy );
		} else context.fillText( "+", cx, cy );
	}
}

function wrapText( context, text, x, y, maxWidth, lineHeight ) {
	var words = text.split( ' ' );
	var line = '';

	var passage = [];
	for( var n = 0; n < words.length; n++ ) {
		var testLine = line + words[ n ] + ' ';
		var metrics = context.measureText( testLine );
		var testWidth = metrics.width;
		if( testWidth > maxWidth && n > 0 ) {
			passage.push( line )
			line = words[ n ] + ' ';
		} else line = testLine;
	}
	passage.push( line );

	if( passage.length >= 2 ) {
		var passageheight = ( passage.length - 1 ) * lineHeight;
		var yval = y - ( passageheight / 2.0 )
		for( var i = 0; i < passage.length; i++ ) {
			context.fillText( passage[i], x, yval );
			yval += lineHeight;
		}
	} else context.fillText( passage[0], x, y );
}

canvas.addEventListener( "mousedown", onMouseDown, false );

function onMouseDown( event ) {
	if( iconsLoaded && audioLoaded && !isFullscreen() )
		requestFullscreen();
}
