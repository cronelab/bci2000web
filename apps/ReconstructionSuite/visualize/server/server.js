import path from 'path';
import express from 'express';
import routes from './routes.js';
const app = express();
let __dirname = path.resolve(path.dirname(''));

const PORT = process.env.PORT || 80;

app.use('/', routes(express));
app.use(express.static(path.resolve(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
app.listen(PORT, () => console.log(`Serving on port: ${PORT}`));
