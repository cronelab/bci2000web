#!/usr/bin/env/ node

// ======================================================================== //
//
// bci2000web.js
// A node-based implementation of web-socket based BCI2000 remote control
//
// ======================================================================== //

'use strict'
const path = require( 'path' );
const fs = require( 'fs' );
const express = require( 'express' );
const app = express();
const expressWs = require( 'express-ws' )( app );
const Telnet = require( 'telnet-client' );
const helpers = require('./helpers.js');
const config = require('./config.json');
const opn = require('opn');
const operatorPath = `${path.resolve(config.bci2kdir)}/prog/Operator.exe`;
// const dgram = require('dgram');
// const UDPSocket = dgram.createSocket('udp4');

const findCards = (currentDirPath) => {
	let cards = [];
    fs.readdirSync(currentDirPath).forEach(name => {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile() && path.basename(filePath) == 'card.ejs') {
        	cards.push(path.resolve(filePath));
        } else if (stat.isDirectory()) {
        	cards = cards.concat( findCards( filePath ) );
        }
    });
    return cards;
}

app.set('views', path.join(__dirname, '/web'))

app.get('/web/index.html', (req, res) => {
	let cardPaths = findCards('./web/paradigms');
	let cards = cardPaths.map(cardPath => {
		let cardDir = path.dirname( cardPath );
		let cardDirParts = cardDir.split( path.sep );
		let cardRoot = cardDirParts.slice( cardDirParts.length - 2).join('/');
		let cardName = cardDirParts[cardDirParts.length - 1];
		return {
			name: cardName,
			path: cardPath,
			root: cardRoot
		};
	} );
	res.render( 'index', {cards: cards});
} );

const connectTelnet = async operator => {
	const op = operator;
	const connection = new Telnet();
	const telnetParams = {
		host: '127.0.0.1',
		port: config.telnetPort,
		timeout: 3000,
		shellPrompt: '>',
		echoLines: 0,
		execTimeout: 3000,
	};

	// Cache new parameters in the operator process object
	op.telnet	 		= null;
	op.commandQueue 	= [];
	op.executing 		= null;

	connection.on( 'ready', prompt => op.telnet = connection);
	connection.on( 'timeout', () => op.executing = null);
	connection.on('close', () =>  process.exit(0));

	await connection.connect( telnetParams );

	// Set up WebSocket handler
	app.ws( '/', ws => {
		ws.on( 'message', (msg) => {
			let preamble = msg.split( ' ' );
			msg = {};
			msg.opcode = preamble.shift();
			msg.id = preamble.shift();
			msg.contents = preamble.join( ' ' );
			msg.ws = ws;
			if ( msg.opcode == 'E' ) op.commandQueue.push(msg)
		});
	});

	// // Set up UDP socket to send out state/watch information (not really needed since state info is sent out via bci2k's execute('Get System State')...)
	// UDPSocket.bind(3333,'127.0.0.1');
	// UDPSocket.on('listening', function () {
	// 	var address = UDPSocket.address();
	// 	console.log('UDP Server listening on ' + address.address + ":" + address.port);
	// });
	// //Example case of using ConnectorOutput to send out what the Stimulus Code is:
	// UDPSocket.on('message', function(message, remote){
	// 	if(String.fromCharCode.apply(null, new Uint16Array(message)).indexOf("StimulusCode")==0)
	// 	ws.send("StimulusCode is: " + parseFloat(BCIString.substring(BCIString.length-3,BCIString.length+3)));
	// });

	// Start command execution loop
	(function syncCommunications() {
		if (op.commandQueue.length && op.telnet && !op.executing) {
			op.executing = op.commandQueue.shift();
			try {
				op.executing.ws.send( [ 'S', op.executing.id ].join( ' ' ).trim() );
			} catch ( e ) {
				/* client stopped caring */
			}

			op.telnet.exec( op.executing.contents, response => {
				var ws = op.executing.ws;
				var id = op.executing.id;
				op.executing = null;
				try {
					ws.send([ 'O', id, response].join(' ').trim());
					ws.send(['D', id].join(' ').trim());
				} catch ( e ) {
					/* client stopped caring */
				}
			});
		}
	setTimeout(syncCommunications, 20);
	})();
};



helpers.isRunning('operator.exe','myprocess','myprocess')
.then(v => {
	if(!v){
		helpers.launchOperator(operatorPath, config.telnetPort,config.hide)
		.then(x => new Promise(resolve => setTimeout(() => resolve(x),1000)))
		.then(operator => {
			connectTelnet(operator,config.telnetPort)
			opn('http://localhost')
		})
		.catch(reason => console.log(reason));
	}
})

app.set( 'view engine', 'ejs' );
app.use( express.static( './' ) );
app.listen(config.webPort, () => {} );