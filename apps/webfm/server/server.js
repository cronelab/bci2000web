import express from "express";
import bodyParser from "body-parser"
import compression from "compression";
import infoRoutes from "./routes/info.js";
import dataRoutes from "./routes/data.js";
import routes from "./routes.js";
import config from "../webpack.config.js";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpack from "webpack";
import multer from 'multer'
import path from "path";
import pkg from "webpack-merge";
const { merge } = pkg;

let __dirname = path.resolve(path.dirname(""));
const app = express();
var upload = multer();

app.use(compression());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(upload.any());

const PORT = process.env.PORT || 8090;

// let newConfig = merge(config, {
//   plugins: [
//     // new webpack.optimize.OccurrenceOrderPlugin(true),
//     new webpack.HotModuleReplacementPlugin(),
//   ],
// });

// const compiler = webpack(config);
// app.use(webpackDevMiddleware(compiler));
app.use("/", routes(express));
app.use("/", infoRoutes(express));
app.use("/", dataRoutes(express));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

app.use(express.static(path.join(__dirname, 'dist')));


app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
 