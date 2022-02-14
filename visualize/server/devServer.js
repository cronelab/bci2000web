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
const PORT = process.env.PORT || 80;

app.use('/', routes(express));
// app.use(express.static(path.resolve(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
app.listen(PORT, () => console.log(`Serving on port: ${PORT}`));
