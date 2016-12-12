#!/usr/bin/env/ node

// ======================================================================== //
//
// bci2000web.js
// A node-based implementation of web-socket based BCI2000 remote control
//
// ======================================================================== //

// Arguments
var argv = require( 'yargs' )

	.usage( 'Usage: $0 [options]' )

	.option( 'b',  {
		alias: 'bci2kdir',
		describe: 'Specify BCI2000 root directory',
		type: 'string',
		nargs: 1,
		default: 'C:\\bci2000',
	} )

	.option( 'p', {
		alias: 'port',
		describe: 'Specify port for webserver and websocket',
		type: 'string',
		nargs: 1,
		default: '80',
	} )


	.option( 't', {
		alias: 'telnet',
		describe: 'Specify the telnet port manually',
		type: 'string',
		nargs: 1,
		default: '3999'
	} )

	.alias( 'v', 'version' )
	.version( function() { return require( './package' ).version; } )
	.describe( 'v', 'Show version information' )

	.help( 'h' )
	.alias( 'h', 'help' )
	.showHelpOnFail( false, 'Specify --help for available options' )
	.epilog( 'Copyright Cronelab 2016, Licensed under MIT' )
	.argv;

var bci2kdir = argv.bci2kdir;
var telnet_port = parseInt( argv.telnet );
var web_port = parseInt( argv.port );

// Static web server
var express = require( 'express' );
var app = express();
var expressWs = require( 'express-ws' )( app );

app.use( express.static( './' ) );

app.listen( web_port, function() {
	console.log( "BCI2000Web serving static files on port " + web_port );
} );

// Fork Operator.exe as a child process
const path = require( 'path' );
const fs = require( 'fs' );
const spawn = require( 'child_process' ).spawn;

var working_directory = path.join( bci2kdir, 'prog' )
var operator_path = path.join( working_directory, 'Operator.exe' )

if( !fs.existsSync( operator_path ) ) {
	console.error( operator_path, "does not exist.  Use the -bci2kdir flag." );
	process.exit( 1 );
}

console.log( "Launching ", operator_path )

const operator = spawn( operator_path, [ 
	'--Telnet', '*:' + telnet_port.toString(),
	'--StartupIdle', '--Title', 'BCI2000Web', '--Hide'
	], { cwd: working_directory } );

operator.stdout.on( 'data', function( data ) {
	console.log( 'Operator.exe: ' + data  );
} );

operator.stderr.on( 'data', function( data ) {
	console.log( 'Operator.exe ERROR: ' + data );
} );

operator.on( 'close', function( data ) {
	console.log( 'Operator.exe exited with code ' + code );
} );

// JS should totes have string trim...
if( typeof( String.prototype.trim ) === "undefined" )
{
    String.prototype.trim = function() 
    {
        return String( this ).replace( /^\s+|\s+$/g, '' );
    };
}

// Connect to Operator.exe via telnet
var telnet = require( 'telnet-client' );
var connection = new telnet();

var telnet_params = { 
	host: '127.0.0.1',
	port: telnet_port,
	timeout: 3000,
	shellPrompt: '>',
	echoLines: 0,
	execTimeout: 100,
};

operator.telnet = null;
connection.on( 'ready', function( prompt ) {
	operator.telnet = connection;
} );

connection.on( 'timeout', function() {
	console.log( 'Command to BCI2000 Operator timed out, ya dingus.' );
	executing = null;
} );

connection.connect( telnet_params );

var command_queue = [];

app.ws( '/', function( ws, req ) {
	ws.on( 'message', function( msg ) {
		var preamble = msg.split( ' ' );
		var msg = Object();
		msg.opcode = preamble.shift();
		msg.id = preamble.shift();
		msg.contents = preamble.join( ' ' );
		msg.ws = ws;

		if( msg.opcode == 'E' )
			command_queue.push( msg );
	} );
} );

var executing = null;
( function sync_communications() {
	if( command_queue.length && operator.telnet && !executing ) {
		executing = command_queue.shift();
		try { executing.ws.send( [ 'S', executing.id ].join( ' ' ).trim() ); }
		catch( e ) { /* client stopped caring */ )}
		operator.telnet.exec( executing.contents, function( err, response ) {
			var ws = executing.ws;
			var id = executing.id;
			executing = null;
			try {
				ws.send( [ 'O', id, response ].join( ' ' ).trim() );
				ws.send( [ 'D', id ].join( ' ' ).trim() );
			} catch( e ) { /* client stopped caring */ }
		} );
	} setTimeout( sync_communications, 20 );
} )();