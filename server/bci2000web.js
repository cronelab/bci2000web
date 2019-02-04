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
const config = require('./Config/config.json');
const opn = require('opn');

const operatorPath = `${path.resolve(config.bci2kdir)}/prog/Operator.exe`;
const merge = require("webpack-merge");
const webpack = require("webpack");
const webpackConfig = require("../webpack.config.js");
let newConfig = merge(webpackConfig, {
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});

app.get('/paradigms/:task/', (req, res) => {
  const data = require(`./paradigms/${req.params.task}/task.json`)
  res.json(data);

});

app.get('/paradigms/:task/task', (req, res) => {
  res.sendFile(path.join(__dirname,`paradigms/${req.params.task}/task.js`))
});

app.get('/amplifiers/', (req, res) => {
  const data = require(`./Config/amplifiers.json`)
  res.json(data);
});

app.get("/localconfig", (req,res) => {
  const data = require('./Config/localconfig.json')
  res.json(data)
})
  app.get('/paradigms', (req, res) => {
	const cardPaths = helpers.findCards('./server/paradigms');
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

  app.get("/subjects", (req, res) => {
		const dataPaths = helpers.findData("./data");
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}
		let subjects = dataPaths
			.map(x => {
				return x.split(path.sep).slice(x.split(path.sep).length - 3)[0];
			})
			.filter(onlyUnique);
		res.send(subjects);
	});
	app.get("/api/:subj", (req, res) => {
		let subject = req.params.subj;
		const dataPaths = helpers.findData(`./data/${subject}`);
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}
		let tasks = dataPaths
			.map(x => {
				return x.split(path.sep).slice(x.split(path.sep).length - 2)[0];
			})
			.filter(onlyUnique);
		res.send(tasks);
	});
	app.get("/api/:subj/:task", (req, res) => {
		let subject = req.params.subj;
		let task = req.params.task;
		const dataPaths = helpers.findData(`./data/${subject}/${task}`);
	
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		}
		let runs = dataPaths
			.map(x => {
				return x.split(path.sep).slice(x.split(path.sep).length - 1)[0];
			})
			.filter(onlyUnique);
		res.send(runs);
	});
	  
  

  if (process.env.NODE_ENV == "production") {
    app.use("/", express.static("./dist"));

  } else if (process.env.NODE_ENV == "development") {
    const compiler = webpack(newConfig);
    app.use(require("webpack-dev-middleware")(compiler, { noInfo: true }));
    app.use(require("webpack-hot-middleware")(compiler));
  }
  else{
    app.use("/", express.static("./dist"));

  }
  

const connectTelnet = async operator => {
  const connection = new Telnet();
  const telnetParams = {
    host: "127.0.0.1",
    port: config.telnetPort,
    timeout: 3000,
    shellPrompt: ">",
    echoLines: 0,
    execTimeout: 30
  };

  // Cache new parameters in the operator process object
  operator.telnet = null;
  operator.commandQueue = [];
  operator.executing = null;

  connection.on("ready", () => (operator.telnet = connection));
  connection.on("timeout", () => (operator.executing = null));
  connection.on("close", () => process.exit(0));

  await connection.connect(telnetParams);

  //Fixes an idiotic race condition where the WS isn't set up until AFTER bci2000 connects
  //arbitrary time, in the future set this into the config.json
  await new Promise(resolve => setTimeout(resolve, 2000));
  // Set up WebSocket handler
  app.ws("/", ws => {
    ws.on("message", msg => {
      let preamble = msg.split(" ");
      var msg = {};
      msg.opcode = preamble.shift();
      msg.id = preamble.shift();
      msg.contents = preamble.join(" ");
      msg.ws = ws;
      if (msg.opcode == "E") {
        operator.commandQueue.push(msg);
      }
    });
  });

  // Start command execution loop
  (function syncCommunications() {
    if (
      operator.commandQueue.length &&
      operator.telnet &&
      !operator.executing
    ) {
      operator.executing = operator.commandQueue.shift();
      try {
        operator.executing.ws.send(
          ["S", operator.executing.id].join(" ").trim()
        );
      } catch (e) {
        /* client stopped caring */
      }

      operator.telnet.exec(operator.executing.contents, (err, response) => {
        let ws = operator.executing.ws;
        let id = operator.executing.id;
        operator.executing = null;
        try {
          ws.send(["O", id, response].join(" ").trim());
          ws.send(["D", id].join(" ").trim());
        } catch (e) {
          /* client stopped caring */
        }
      });
    }
    setTimeout(syncCommunications, 20);
  })();
};



helpers.isRunning("operator.exe", "myprocess", "myprocess").then(v => {
  if (!v) {
    helpers
      .launchOperator(operatorPath, config.telnetPort, config.hide)
      .then(
        x =>
          new Promise(resolve =>
            setTimeout(() => resolve(x), config.telnetTimeout)
          )
      )
      .then(operator => {
        connectTelnet(operator, config.telnetPort);
        if(config.autoOpen) opn("http://127.0.0.1");
      })
      .catch(reason => console.log(reason));
  }
});


app.listen(config.webPort, () => {} );