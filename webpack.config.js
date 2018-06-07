/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require(path.resolve(__dirname, 'package.json'));

// Default config, common to everything
const defaultConfig = {
  target: 'web',
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
      mode: env.production ? 'production' : 'development',
      entry: {
        main: path.resolve(__dirname, 'src', 'index.js'),
        ce: path.resolve(__dirname, 'src', 'index.ce.js'),
      },
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: env.dev ? '[id].[name].[hash:6].js' : `${pkg.name}-[name].js`,
        library: 'TaxonomyVisualisation',
        libraryExport: 'default',
      },
      plugins: [
        env.production
          ? new webpack.optimize.ModuleConcatenationPlugin()
          : null,
        env.production ? webpack.optimize.minimize : null,
        env.dev ? new webpack.HotModuleReplacementPlugin() : null,
        env.dev
          ? new HtmlWebpackPlugin({
              title: pkg.name,
              template: path.join(__dirname, 'example', 'index.template.html'),
              inject: false,
            })
          : null,
        env.dev
          ? new HtmlWebpackPlugin({
              template: path.join(
                __dirname,
                'example',
                'index_ce.template.html'
              ),
              filename: 'index_ce.html',
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
