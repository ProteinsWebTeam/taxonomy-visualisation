/* eslint-env node */
const path = require('path');

// const webpack = require('webpack');
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
        env.dev
          ? new HtmlWebpackPlugin({
              title: pkg.name,
              template: path.join(__dirname, 'example', 'index.template.html'),
              chunks: ['main'],
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
              chunks: ['ce'],
            })
          : null,
      ].filter((x) => x),
      performance: {
        hints: env.production && !env.debug ? 'error' : false,
      },
      devtool: env.dev ? 'cheap-module-source-map' : 'source-map',
    },
    defaultConfig
  );
  // If in dev, return early with *one* config
  if (env.dev)
    return Object.assign(
      {
        devServer: {
          hot: true,
          static: {
            directory: path.join(__dirname),
            watch: {
              ignored: /node_modules/,
            },
          },
        },
        watchOptions: {
          ignored: /node_modules/,
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
      externals: {
        'd3-array': 'd3-array',
        'd3-ease': 'd3-ease',
        'd3-hierarchy': 'd3-hierarchy',
        'd3-selection': 'd3-selection',
        'd3-shape': 'd3-shape',
        'd3-zoom': 'd3-zoom',
      },
    }),
  ];
};
