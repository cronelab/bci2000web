import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack'
let __dirname = path.resolve(path.dirname(''));
const devMode = 'development';

const module = {
  mode: devMode ? 'development' : 'production',
  // devServer: {
  //   static: {
  //     directory: path.join(__dirname, 'dist'),
  //   },
  //   port: 8055,
  //   hot: true,
  //   historyApiFallback: true,
  // },
  devtool: devMode ? 'inline-source-map' : 'source-map',
  entry: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', './src/index.tsx'],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  output:{
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].bundle.js',
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
          presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          plugins: ['@babel/transform-runtime', 'react-refresh/babel', "@babel/plugin-transform-async-to-generator"],
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
    new webpack.HotModuleReplacementPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',

    }),
  ],
};
export default module;
