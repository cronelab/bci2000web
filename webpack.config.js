import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";
import WriteFilePlugin from "write-file-webpack-plugin";
let __dirname = path.resolve(path.dirname(""));

import MiniCssExtractPlugin from "mini-css-extract-plugin";
var hotMiddlewareScript =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

const devMode = process.env.NODE_ENV !== "production";

const module = {
  entry: {
    index: devMode
      ? ["./src/index/index.js", hotMiddlewareScript]
      : "./src/index/index.js",
    tasks: devMode
      ? ["./src/tasks/tasks.js", hotMiddlewareScript]
      : "./src/tasks/tasks.js",
    ssrender: devMode
      ? ["./src/SSRendering/index.js", hotMiddlewareScript]
      : "./src/SSRendering/index.js"
  },
  mode: devMode ? "development" : "production",

  devtool: devMode ? "inline-source-map" : "source-map",

  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    },
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
        // use: [{}
        //   devMode ? "style-loader" : MiniCssExtractPlugin.loader,
        //   "css-loader",
        //   "postcss-loader",
        //   "sass-loader"
        // ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin.CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./src/index/index.html",
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./src/SSRendering/index.html",
      filename: "serverRender.html"
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: "./src/tasks/index.html",
      filename: "task.html"
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].css",
      chunkFilename: devMode ? "[id].css" : "[id].css"
    }),
    new WriteFilePlugin()
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: path.resolve(__dirname, "dist")
  },

  devServer: devMode
    ? {
        contentBase: "./dist",
        publicPath: "./dist",
        hot: true
      }
    : {}
};

export default module;
