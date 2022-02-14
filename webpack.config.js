import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";
import WriteFilePlugin from "write-file-webpack-plugin";
let __dirname = path.resolve(path.dirname(""));
// import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
const devMode = process.env.NODE_ENV !== "production";

const module = {
  mode: devMode ? "development" : "production",
  devtool: devMode ? "inline-source-map" : "source-map",
  entry: {
    main: "./src/index.tsx",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fallback: {
      fs: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|fbx|glb|gltf|nii|mgz)$/i,
        type: "asset/resource",
      },
      {
        test: /\.worker\.ts$/,
        use: {
          loader: "worker-loader",
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
        },
      },
      {
        test: /\.js|jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-transform-modules-commonjs",
              "@babel/plugin-transform-runtime",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-export-default-from",
            ],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     options: {},
          //     plugins: () => {},
          //   },
          // },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  // optimization: {
  //   minimizer: [new TerserPlugin({})],
  // },

  plugins: [
    // new NodePolyfillPlugin(),
    new CleanWebpackPlugin.CleanWebpackPlugin(),
    new WriteFilePlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      fullhash: true,
      chunks: ["main"],
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    globalObject: `typeof self !== 'undefined' ? self : this`,
    publicPath: "/",
  },
};
export default module;
