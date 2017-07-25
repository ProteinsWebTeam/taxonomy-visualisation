const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require(path.resolve(__dirname, 'package.json'));

module.exports = (env = { dev: true }) => ({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[id].[name].[hash].js',
  },
  resolve: {
    modules: [path.resolve('.', 'src'), path.resolve('.', 'node_modules')],
  },
  plugins: [
    env.dev ? new webpack.HotModuleReplacementPlugin() : null,
    env.dev
      ? new HtmlWebpackPlugin({
        title: pkg.name,
        template: path.join(__dirname, 'src', 'index.template.html'),
        inject: false,
      })
      : null,
  ].filter(x => x),
  devtool: '#inline-source-map',
  devServer: env.dev
    ? {
      overlay: true,
      hot: true,
      watchOptions: {
        ignored: /node_modules/,
      },
    }
    : null,
});
