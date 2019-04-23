const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var hotMiddlewareScript =
  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true";

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
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
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
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
