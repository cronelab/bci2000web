// bci2000web.js
//* A node-based implementation of web-socket based BCI2000 remote control

'use strict';
import path from 'path';
import express from 'express';
const app = express();
import expressWs from 'express-ws';
import Telnet from 'telnet-client';
import opn from 'opn';
import udp from 'dgram';
import routes from './routes.js';
import helpers from './helpers.js';
import http from 'http';
import fs from 'fs';
app.use(express.json());

const config = JSON.parse(
  fs.readFileSync('./server/Config/config.json', 'utf8')
);
let __dirname = path.resolve(path.dirname(''));
let operatorPath = path.resolve(__dirname, 'prog/Operator.exe');

const httpServer = http.createServer(app);
const wsInstance = expressWs(app, httpServer);

app.use('/', routes(express));
app.use(express.static(path.resolve(__dirname, 'dist')));

//? Connect to BCI2000's operator telnet port in order to send/receive operator commands.
const connectTelnet = async (operator) => {
  const connection = new Telnet();

  // Cache new parameters in the operator process object
  operator.telnet = null;
  operator.commandQueue = [];
  operator.executing = null;

  connection.on('ready', () => (operator.telnet = connection));
  connection.on('timeout', () => (operator.executing = null));
  connection.on('close', () => process.exit(0));

  try {
    //TODO configure this better
    await connection.connect({
      host: '127.0.0.1',
      port: config.telnetPort,
      timeout: 1000,
      shellPrompt: '>',
      echoLines: 0,
      execTimeout: 30,
    });
  } catch (error) {
    console.log(error);
  }

  //!Fixes an idiotic race condition where the WS isn't set up until AFTER bci2000 connects
  //!arbitrary time, in the future set this into the config.json
  await new Promise((resolve) => setTimeout(resolve, 2000));
  //? Set up WebSocket handler
  app.ws('/', (ws) => {
    ws.on('message', (message) => {
      let msg = JSON.parse(message);
      msg.ws = ws;
      if (msg.opcode == 'E') {
        operator.commandQueue.push(msg);
      }
    });
  });

  // Start command execution loop
  //?Every 20ms send info about connection state/listen for commands
  (function syncCommunications() {
    if (
      operator.commandQueue.length &&
      operator.telnet &&
      !operator.executing
    ) {
      operator.executing = operator.commandQueue.shift();

      operator.telnet.exec(operator.executing.contents, (err, response) => {
        let ws = operator.executing.ws;

        let id = operator.executing.id;
        operator.executing = null;
        if (response != undefined) {
          try {
            let msg = {
              opcode: 'O',
              id: id,
              contents: response.trim(),
            };
            ws.send(JSON.stringify(msg));
          } catch (e) {
            console.log(e);
            /* client stopped caring */
          }
        }
      });
    }
    setTimeout(syncCommunications, 20);
  })();
};
const sleep = (n) => new Promise((resolve) => setTimeout(resolve, n));

(async () => {
  //?Check if BCI2000 is running
  let v = await helpers.isRunning('operator.exe', 'myprocess', 'myprocess');
  //? if not, start BCI2000 operator.exe
  if (!v) {
    let operator = await helpers.launchOperator(
      operatorPath,
      config.telnetPort,
      config.hide
    );
    await sleep(config.telnetTimeout);
    await connectTelnet(operator, config.telnetPort);
    // await sleep(1500);
    // if (config.autoOpen) {
    //   opn('http://127.0.0.1');
    // }
  }
})();
httpServer.listen(80, () => console.log('Server running'));
