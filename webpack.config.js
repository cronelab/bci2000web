import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
let __dirname = path.resolve(path.dirname(''));
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
const devMode = 'development';

const module = {
  mode: devMode ? 'development' : 'production',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // compress: true,
    port: 3000,
    hot: true,
    // client: false,
  },
  devtool: devMode ? 'inline-source-map' : 'source-map',
  entry: {
    main: './src/index.tsx',
    // hot: 'webpack/hot/dev-server.js',
    // Dev server client for web socket transport, hot and live reload logic
    // client: 'webpack-dev-server/client/index.js?hot=true&live-reload=true',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  cache: true,
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: ['@babel/transform-runtime', 'react-refresh/babel'],
          cacheDirectory: true,
        },
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|gb)/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
export default module;
