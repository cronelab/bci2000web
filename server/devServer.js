import path from 'path';
import express from 'express';
import routes from './routes.js';
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import config from '../webpack.development.config.js'


const app = express();
let __dirname = path.resolve(path.dirname(''));


const compiler = webpack(config)

let middle = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  writeToDisk: true
})
app.use(middle)
// app.use(webpackHotMiddleware(compiler))
// app.use(middle)
const PORT = process.env.PORT || 3000;

app.use('/', routes(express));
// app.use(express.static(path.resolve(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
app.listen(PORT, () => console.log(`Serving on port: ${PORT}`));



// import webpack from 'webpack';
// import WebpackDevServer from 'webpack-dev-server'
// import config from '../webpack.config.js';

// const compiler = webpack(config);

// const devServerOptions = { ...config.devServer, open: true };

// const server = new WebpackDevServer(devServerOptions, compiler);

// const runServer = async () => {
//   console.log('Starting server...');
//   await server.start();
// };

// runServer();

// import express from 'express';
// import path from 'path';
// import routes from './routes.js';
// // import vMPLRouter from './robotController.js';
// import journal from './journalEntries.js';
// import { WebSocketServer } from 'ws';
// import http from 'http';
// import fs from 'fs';
// const __dirname = path.resolve(path.dirname(''));
// const app = express();
// const wsServer = new WebSocketServer({ noServer: true });
// app.use(
//   webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath,
//     writeToDisk: true,
//   })
// );
// // app.use(express.static(path.join(__dirname, 'dist')));
// // app.use(webpackHotMiddleware(compiler,{
// //   log: false,
// //   path: "/__webpack_hmr",
// //   heartbeat: 2000
// // }));

// app.use('/', routes(express));
// app.use('/', journal(express));
// // app.use('/', vMPLRouter(express));

// let key, cert, options;
// try {
//   key = fs.readFileSync('./server/server.key');
//   cert = fs.readFileSync('./server/server.cert');
//   options = {
//     key,
//     cert,
//   };
// } catch (err) {
//   // console.error(err);
// }

// // if (key != undefined && cert != undefined) {
// //   https.createServer(options, app).listen(4000);
// // } else {
// http.createServer(app).listen(3000);
// // }
