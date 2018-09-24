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
		default: './',
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

	.option( 'x', {
		alias: 'hide',
		describe: 'Hide BCI2000 window',
		type: 'boolean',
		default: false
	} )

	.option( 'w', {
		alias: 'verbose',
		describe: 'Print all the things!',
		type: 'boolean',
		default: false
	} )

	.alias( 'v', 'version' )
	.version( function() { return require( './package' ).version; } )
	.describe( 'v', 'Show version information' )

	.help( 'h' )
	.alias( 'h', 'help' )
	.showHelpOnFail( false, 'Specify --help for available options' )
	.epilog( 'Copyright Cronelab 2016, Licensed under MIT' )
	.argv;

const path = require( 'path' );
var bci2kdir = path.resolve( argv.bci2kdir );
var telnetPort = parseInt( argv.telnet );
var webPort = parseInt( argv.port );

//UDP socket to communicate with Connector Input/Output
const dgram = require('dgram');
var UDPSocket = dgram.createSocket('udp4');

// Set up EJS-rendering web server

const fs = require( 'fs' );
var express = require( 'express' );
var app = express();
var expressWs = require( 'express-ws' )( app );

app.set( 'view engine', 'ejs' );
app.use( express.static( './' ) );

function findCards( currentDirPath ) {

	var cards = [];

    fs.readdirSync( currentDirPath ).forEach( function( name ) {

        var filePath = path.join( currentDirPath, name );
        var stat = fs.statSync( filePath );

        if ( stat.isFile() && path.basename( filePath ) == 'card.ejs' ) {
        	cards.push( path.resolve( filePath ) );
        } else if ( stat.isDirectory() ) {
        	cards = cards.concat( findCards( filePath ) );
        }

    });

    return cards;

}

app.listen( webPort, function() {
	console.log( "BCI2000Web serving static files on port " + webPort );
} );

app.set( 'views', path.join( __dirname, '/web' ) )

app.get( '/web/index.html', function( req, res ) {

	var cardPaths = findCards( './web/paradigms' );

	var cards = cardPaths.map( function( cardPath ) {

		var cardDir = path.dirname( cardPath );
		var cardDirParts = cardDir.split( path.sep );

		// TODO Super hacky right now
		cardRoot = cardDirParts.slice( cardDirParts.length - 2 ).join( '/' );

		var cardName = cardDirParts[cardDirParts.length - 1];

		return {
			name: cardName,
			path: cardPath,
			root: cardRoot
		};

	} );

	res.render( 'index', {
		cards: cards
	} );

} );


// Set up the operator chain

var checkForOperator = function( checkPaths ) {

	// TODO Allow for patterns on checkPaths

	// Turns a path into a Promise which resolves when the path is determined
	// to be a file. The Promise resolves to the Path of the file to use
	var checkerForPath = function( thePath ) {

		return new Promise( function( resolve, reject ) {

			fs.stat( thePath, function( err, stats ) {

				if ( err ) {
					reject( 'Error checking file', thePath,':', JSON.stringify( err ) );
					return;
				}

				if ( !stats.isFile() ) {
					reject( thePath, 'is not a file.' );
					return;
				}

				// TODO Check if executable

				resolve( thePath );

			} );

		} );

	};

	// Map paths to Promises
	var checkers = checkPaths.map( checkerForPath );

	// Keep running the next checker each time we fail, until we succeed
	// Our initial condition is a rejection (otherwise we short-circuit)
	return checkers.reduce( function( cur, next ) {

		return cur.catch( function( reason ) {

			if ( argv.verbose ) {
				console.log( reason );
			}

			return next;

		} );

	}, Promise.reject( 'YOU FAIL' ) )
		.catch( function( reason ) {

			return Promise.reject( 'Could not find Operator' );

		} );

};

var spawn = require( 'child_process' ).spawn;

var launchOperator = function( operatorPath, telnetPort ) {

	var operatorArgs = [
		// '--Hide',
		'--Telnet', '*:' + telnetPort,
		'--StartupIdle',
		'--Title', '--BCI2000Web'
	];

	if ( argv.hide )
	{
		operatorArgs.push("--Hide");
	}

	var spawnParams = {
		cwd: path.dirname( operatorPath )
	};

	if ( argv.verbose ) {
		console.log( 'Launching', operatorPath );
	}
	var operator = spawn( operatorPath, operatorArgs, spawnParams );

	operator.stdout.on( 'data', function( data ) {
		if ( argv.verbose ) {
			console.log( 'Operator.exe: ' + data  );
		}
	} );

	operator.stderr.on( 'data', function( data ) {
		if ( argv.verbose ) {
			console.log( 'Operator.exe ERROR: ' + data );
		}
	} );

	operator.on( 'close', function( data ) {
		console.log( 'Operator subprocess closed... Operator may already be running?' );
		process.exit(1);
	} );


	// TODO There are fail cases that should be handled ...
	return Promise.resolve( operator );

};

var telnet = require( 'telnet-client' );

var connectTelnet = function( operator, telnetPort ) {

	return new Promise( function( resolve, rejec ) {

		// Cache new parameters in the operator process object

		operator.telnet 		= null;
		operator.commandQueue 	= [];
		operator.executing 		= null;


		// Prepare telnet connection

		var connection = new telnet();

		connection.on( 'ready', function( prompt ) {
			operator.telnet = connection;
			resolve( connection );
		} );

		connection.on( 'timeout', function() {
			operator.executing = null;
		} );

		// Connect to telnet

		var telnetParams = {
			host: '127.0.0.1',
			port: telnetPort,
			timeout: 3000,
			shellPrompt: '>',
			echoLines: 0,
			execTimeout: 100,
		};

		connection.connect( telnetParams );


		// Set up WebSocket handler

		app.ws( '/', function( ws, req ) {

			ws.on( 'message', function( msg ) {

				var preamble = msg.split( ' ' );

				var msg = {};
				msg.opcode = preamble.shift();
				msg.id = preamble.shift();
				msg.contents = preamble.join( ' ' );
				msg.ws = ws;

				if ( msg.opcode == 'E' ) {
					operator.commandQueue.push( msg );
				}

			} );

		} );

		// Set up UDP socket to send out state/watch information (not really needed since state info is sent out via bci2k's execute('Get System State')...)
		UDPSocket.bind(3333,'127.0.0.1');
		UDPSocket.on('listening', function () {
		    var address = UDPSocket.address();
		    console.log('UDP Server listening on ' + address.address + ":" + address.port);
		});
		//Example case of using ConnectorOutput to send out what the Stimulus Code is:
		UDPSocket.on('message', function(message, remote){
			if(String.fromCharCode.apply(null, new Uint16Array(message)).indexOf("StimulusCode")==0)
			ws.send("StimulusCode is: " + parseFloat(BCIString.substring(BCIString.length-3,BCIString.length+3)));
		});

		// Start command execution loop

		( function syncCommunications() {

			if ( operator.commandQueue.length && operator.telnet && !operator.executing ) {

				operator.executing = operator.commandQueue.shift();

				try {
					operator.executing.ws.send( [ 'S', operator.executing.id ].join( ' ' ).trim() );
				} catch ( e ) {
					/* client stopped caring */
				}

				operator.telnet.exec( operator.executing.contents, function( err, response ) {

					var ws = operator.executing.ws;
					var id = operator.executing.id;

					operator.executing = null;

					try {
						ws.send( [ 'O', id, response ].join( ' ' ).trim() );
						ws.send( [ 'D', id ].join( ' ' ).trim() );
					} catch ( e ) {
						/* client stopped caring */
					}

				} );

			}

			setTimeout( syncCommunications, 20 );

		} )();

	} );

};


// Run the operator chain

var checkPaths = [
	path.join( bci2kdir, 'prog', 'Operator.exe' )
];

checkForOperator( checkPaths )
	.then( function( operatorPath ) {
		return launchOperator( operatorPath, telnetPort )
	} )
	.then( function( operator ) {
		return connectTelnet( operator, telnetPort );
	} )
	.then( function( telnetConnection ) {
		console.log( 'Operator telnet connection ready' );
		/* Do things */
	} )
	.catch( function( reason ) {
		console.log( reason );
	} );
