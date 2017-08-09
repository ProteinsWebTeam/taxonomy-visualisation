/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require(path.resolve(__dirname, 'package.json'));

// Default config, common to everything
const defaultConfig = {
  target: 'web',
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
};

module.exports = (env = { dev: true }) => {
  const configWithEnv = Object.assign(
    {
      entry: env.dev
        ? path.resolve(__dirname, 'example', 'index.js')
        : path.resolve(__dirname, 'src', 'index.js'),
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: env.dev ? '[id].[name].[hash:6].js' : `${pkg.name}.js`,
        library: 'TaxonomyVisualisation',
      },
      plugins: [
        env.production
          ? new webpack.optimize.ModuleConcatenationPlugin()
          : null,
        env.production
          ? new webpack.optimize.UglifyJsPlugin({
              beautify: env.debug,
              mangle: {
                keep_fnames: env.debug,
              },
              comments: env.debug,
              sourceMap: '#source-map',
            })
          : null,
        env.dev ? new webpack.HotModuleReplacementPlugin() : null,
        env.dev
          ? new HtmlWebpackPlugin({
              title: pkg.name,
              template: path.join(__dirname, 'example', 'index.template.html'),
              inject: false,
            })
          : null,
      ].filter(x => x),
      performance: {
        hints: env.production && !env.debug ? 'error' : false,
      },
      devtool: env.dev ? '#inline-source-map' : '#source-map',
    },
    defaultConfig
  );
  // If in dev, return early with *one* config
  if (env.dev)
    return Object.assign(
      {
        devServer: {
          overlay: true,
          hot: true,
          watchOptions: {
            ignored: /node_modules/,
          },
        },
      },
      configWithEnv
    );
  // Otherwise, return with an array of configs
  return [
    // Standard, all included
    configWithEnv,
    // Without d3 (assumes is external, loaded by whoever is using the lib)
    Object.assign({}, configWithEnv, {
      output: Object.assign({}, configWithEnv.output, {
        filename: configWithEnv.output.filename.replace(
          '.js',
          '-without-d3.js'
        ),
      }),
      externals: { d3: 'd3' },
    }),
  ];
};
