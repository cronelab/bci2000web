import express from 'express';
import path from 'path';
import routes from './routes.js';
// import vMPLRouter from './robotController.js';
import journal from './journalEntries.js';
import { WebSocketServer } from 'ws';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import https from 'https';
import http from 'http';
import fs from 'fs';
const __dirname = path.resolve(path.dirname(''));
const app = express();
const wsServer = new WebSocketServer({ noServer: true });
import config from '../webpack.config.js';
const compiler = webpack(config);
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: '/',
    writeToDisk: true,
  })
);
// app.use(express.static(path.join(__dirname, 'dist')));
// app.use(webpackHotMiddleware(compiler,{
//   log: false,
//   path: "/__webpack_hmr",
//   heartbeat: 2000
// }));

app.use('/', routes(express));
app.use('/', journal(express));
// app.use('/', vMPLRouter(express));

let key, cert, options;
try {
  key = fs.readFileSync('./server/server.key');
  cert = fs.readFileSync('./server/server.cert');
  options = {
    key,
    cert,
  };
} catch (err) {
  // console.error(err);
}

// if (key != undefined && cert != undefined) {
//   https.createServer(options, app).listen(4000);
// } else {
http.createServer(app).listen(3000);
// }
