/**
 * Created by apkawa on 28.08.16.
 */

const _ = require('lodash')
const path = require('path')
const webpack = require('webpack')
const StringReplacePlugin = require('string-replace-webpack-plugin')

const envs = require('../../../libs/envs')

import webpackEntry from '../../../libs/webpack_entry'
import FILTERS from './filters'

const cssLoader = (importLoaders = 0) => 'css-loader?modules=true&importLoaders=' + importLoaders
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => {
      return [
        require('precss'),
        require('autoprefixer'),
        // require('cssnano')({zindex: false}),
      ]
    },
  },
}

const EXTRA_OPTIONS = {
  providePlugin: null,
}

const WEBPACK_OPTIONS = {
  ...EXTRA_OPTIONS,
  cache: true,
  watch: false,
  devtool: 'cheap-module-eval-source-map',
  entry: {},
  output: {
    path: '{{ project.path.dist.js }}',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '{{ project.webpack.publicPath }}',
    sourceMapFilename: '../_maps/[file].map',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: ['{{ project.path.app.js }}'],
        exclude: [/node_modules/, /vendors/],
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          cssLoader(1),
          postcssLoader,
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          cssLoader(2),
          postcssLoader,
          'less-loader',
        ],
      },

      {
        test: /\.(scss|sass)$/,
        use: [
          'style-loader',
          cssLoader(3),
          postcssLoader,
          'sass-loader',
          'import-glob-loader',
        ],
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          cssLoader(1),
          'stylus-loader',
        ],
      },

      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          mimetype: 'application/octet-stream',
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          mimetype: 'image/svg+xml',
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      },
      {
        test: /\.(swig|html)$/,
        loader: 'html-loader',
      },
    ],
    noParse: /\.min\.js/,
  },
  resolve: {
    modules: [
      '{{ project.path.app.js }}',
      '{{ project.app_root }}',
      '{{ project.project_root }}',
      '{{ project.path.node_modules }}',
    ],
    extensions: ['.js', '.jsx'],
    alias: {},
  },
  plugins: [
    new StringReplacePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.js',
      minChunks: 2,
    }),
  ],
  node: {
    fs: 'empty',
    file: 'empty',
    directory: 'empty',
    debug: 'empty',
    net: 'empty',
    child_process: 'empty',
    readline: 'empty',
  },
}

function getOptions (config) {
  let webpack_options = _.get(config, 'webpack.options')
  webpack_options.entry = webpackEntry(config)

  for (let i in FILTERS) {
    const filter = FILTERS[i]
    webpack_options = filter(webpack_options, config)
  }
  return webpack_options
}

export default {
  getOptions,
  options: WEBPACK_OPTIONS,
}
