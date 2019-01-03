#!/usr/bin/env/ node

// bci2000web.js
// A node-based implementation of web-socket based BCI2000 remote control

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

const findData = (currentDirPath) => {
	let data = [];
	fs.readdirSync(currentDirPath).forEach((name) => {
	  const filePath = path.join(currentDirPath, name);
  
	  const stat = fs.statSync(filePath);
	  if (stat.isFile() && path.extname(filePath) === '.dat') {
		data.push(path.resolve(filePath).split('.').slice(0, -1).join('.'));
	  } else if (stat.isDirectory()) {
		data = data.concat(findData(filePath));
	  }
	});
	return data;
  };

  app.get('/paradigms', (req, res) => {
	const cardPaths = findCards('./web/paradigms');
	const cards = cardPaths.map((cardPath) => {
	  const cardDir = path.dirname(cardPath);
	  const cardDirParts = cardDir.split(path.sep);
	  const cardRoot = cardDirParts.slice(cardDirParts.length - 2).join('/');
	  const cardName = cardDirParts[cardDirParts.length - 1];
	  return {
		name: cardName,
		path: cardPath,
		root: cardRoot,
	  };
	});
	res.send(cards);
  });

  app.get('/subjects', (req, res) => {
	const dataPaths = findData('./data');
	function onlyUnique(value, index, self) { 
	  return self.indexOf(value) === index;
	}
	let subjects = dataPaths.map(x =>{
	  return x.split(path.sep).slice(x.split(path.sep).length-3)[0];
	}).filter( onlyUnique )
	res.send(subjects);
  })
  app.get('/api/:subj', (req, res) => {
	let subject = req.params.subj;
	const dataPaths = findData(`./data/${subject}`);
	function onlyUnique(value, index, self) { 
	  return self.indexOf(value) === index;
	}
	let tasks = dataPaths.map(x =>{
	  return x.split(path.sep).slice(x.split(path.sep).length-2)[0];
	}).filter( onlyUnique )
	res.send(tasks);
  })
  app.get('/api/:subj/:task', (req, res) => {
	let subject = req.params.subj;
	let task = req.params.task;
	const dataPaths = findData(`./data/${subject}/${task}`);

	function onlyUnique(value, index, self) { 
		return self.indexOf(value) === index;
	  }
	  let runs = dataPaths.map(x =>{
		return x.split(path.sep).slice(x.split(path.sep).length-1)[0];
	  }).filter( onlyUnique )
	  res.send(runs);
	})
	  
  

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
	// const op = operator;
	const connection = new Telnet();
	const telnetParams = {
		host: '127.0.0.1',
		port: config.telnetPort,
		timeout: 3000,
		shellPrompt: '>',
		echoLines: 0,
		execTimeout: 30,
	};

	// Cache new parameters in the operator process object
	operator.telnet	 		= null;
	operator.commandQueue 	= [];
	operator.executing 		= null;

	connection.on( 'ready', () => operator.telnet = connection);
	connection.on( 'timeout', () => operator.executing = null);
	connection.on('close', () =>  process.exit(0));

	await connection.connect( telnetParams );

	// Set up WebSocket handler
	app.ws( '/', ws => {
		ws.on( 'message', (msg) => {
			let preamble = msg.split( ' ' );
			var msg = {};
			msg.opcode = preamble.shift();
			msg.id = preamble.shift();
			msg.contents = preamble.join( ' ' );
			msg.ws = ws;
			if ( msg.opcode == 'E' ) 
			{
				operator.commandQueue.push(msg)
			}
		});
	});

	// Start command execution loop
	(function syncCommunications() {
		if (operator.commandQueue.length && operator.telnet && !operator.executing) {
			operator.executing = operator.commandQueue.shift();
			try {
				operator.executing.ws.send( [ 'S', operator.executing.id ].join( ' ' ).trim() );
			} catch ( e ) {
				/* client stopped caring */
			}

			operator.telnet.exec( operator.executing.contents, (err, response) => {
				let ws = operator.executing.ws;
				let id = operator.executing.id;
				operator.executing = null;
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
		.then(x => new Promise(resolve => setTimeout(() => resolve(x),config.telnetTimeout)))
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