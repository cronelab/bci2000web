import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

import WriteFilePlugin from "write-file-webpack-plugin";
let __dirname = path.resolve(path.dirname(""));
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const devMode = process.env.NODE_ENV !== "production";

const module = {
	mode: devMode ? "development" : "production",
	devtool: devMode ? "inline-source-map" : "source-map",
	entry: {
		main: './src/Index.jsx',
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env", "@babel/preset-react"],
					plugins: [
						"@babel/plugin-syntax-dynamic-import",
						"@babel/plugin-transform-modules-commonjs",
						"@babel/plugin-transform-runtime",
						"@babel/plugin-proposal-class-properties",
						"@babel/plugin-proposal-export-default-from",
						"@babel/plugin-transform-async-to-generator"
					],
					cacheDirectory: true
				}
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [{
					loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader
				},
				{
					loader: "css-loader"
				},
				{
					loader: "postcss-loader",
					options: {
						options: {
							plugins: () => [require('autoprefixer')({}),require('autoprefixer')({})],
						},
					  }
				},
				{
					loader: "sass-loader"
				}
				]
			},
		]
	},
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

	plugins: [
		new CleanWebpackPlugin(),
		new WriteFilePlugin(),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: "index.html",
			hash: true,
			chunks: ["main"]
		})
	],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].[hash].js",
		globalObject: `typeof self !== 'undefined' ? self : this`,
		publicPath: '/'

	}
};
export default module;