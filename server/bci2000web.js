// bci2000web.js
//* A node-based implementation of web-socket based BCI2000 remote control

"use strict";
import path from "path";
import express from "express";
const app = express();
import expressWs from "express-ws";
import Telnet from "telnet-client";

import opn from "opn";
import dgram from "dgram";
import routes from "./routes.js";
import helpers from "./helpers.js";
import http from "http";
import https from "https";
import fs from "fs";
const config = JSON.parse(
  fs.readFileSync("./server/Config/config.json", "utf8")
);
const operatorPath = `${path.resolve(config.bci2kdir)}/prog/Operator.exe`;

import merge from "webpack-merge";
import webpack from "webpack";
import webpackConfig from "../webpack.config.js";
let newConfig = merge(webpackConfig, {
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("./server/credentials/server.key"),
    cert: fs.readFileSync("./server/credentials/server.crt")
  },
  app
);
const httpServer = http.createServer(app);

expressWs(app, httpsServer);
expressWs(app, httpServer);

app.use("/", routes(express));
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

if (process.env.NODE_ENV == "production") {
  app.use("/", express.static("./dist"));
} else if (process.env.NODE_ENV == "development") {
  const compiler = webpack(newConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      noInfo: true
    })
  );
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use("/", express.static("./dist"));
}
//? Connect to BCI2000's operator telnet port in order to send/receive operator commands.
const connectTelnet = async operator => {
  const connection = new Telnet();

  // Cache new parameters in the operator process object
  operator.telnet = null;
  operator.commandQueue = [];
  operator.executing = null;

  connection.on("ready", () => (operator.telnet = connection));
  connection.on("timeout", () => (operator.executing = null));
  connection.on("close", () => process.exit(0));

  //TODO configure this better
  await connection.connect({
    host: "127.0.0.1",
    port: config.telnetPort,
    timeout: 1000,
    shellPrompt: ">",
    echoLines: 0,
    execTimeout: 30
  });

  let socket = dgram.createSocket("udp4");
  operator.telnet.exec(
    "Add Watch System State at 127.0.0.1:21501",
    (err, res) => {
      console.log(res);
    }
  );
  socket.bind({
    address: "127.0.0.1",
    port: 21501
  });

  //!Fixes an idiotic race condition where the WS isn't set up until AFTER bci2000 connects
  //!arbitrary time, in the future set this into the config.json
  await new Promise(resolve => setTimeout(resolve, 2000));
  //? Set up WebSocket handler
  app.ws("/", ws => {
    ws.on("message", msg => {
      let preamble = msg.split(" ");
      var msg = {};
      msg.opcode = preamble.shift();
      msg.id = preamble.shift();
      msg.contents = preamble.join(" ");
      console.log(msg.contents);
      msg.ws = ws;
      if (msg.opcode == "E") {
        operator.commandQueue.push(msg);
      }
    });
    socket.on("message", (msg, rinfo) => {
      if (ws.readyState == ws.OPEN) {
        let watchMsg = msg
          .toString()
          .split("\n")[0]
          .split("\t")[1];
        ws.send(["X", 0, watchMsg].join(" ").trim());
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
//?Check if BCI2000 is running
helpers.isRunning("operator.exe", "myprocess", "myprocess").then(v => {
  //? if not, start BCI2000 operator.exe
  if (!v) {
    helpers
      .launchOperator(operatorPath, config.telnetPort, config.hide)
      //?Add a timeout...
      .then(
        x =>
          new Promise(resolve =>
            setTimeout(() => resolve(x), config.telnetTimeout)
          )
      )
      //? ...so we can connect to the telnet port without throwing an erro.
      .then(operator => {
        connectTelnet(operator, config.telnetPort);
      })
      //?More timeouts
      //TODO make more elegant.
      .then(x => {
        new Promise(resolve =>
          setTimeout(() => {
            resolve(x);
            //? Automatically open a browser to go to BCI2000Web
            if (config.autoOpen) {
              opn("http://127.0.0.1");
            }
          }, 1500)
        );
      })
      .catch(reason => console.log(reason));
  }
});
httpsServer.listen(443);
httpServer.listen(80);
