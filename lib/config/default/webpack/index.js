'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack_entry = require('../../../libs/webpack_entry');

var _webpack_entry2 = _interopRequireDefault(_webpack_entry);

var _filters = require('./filters');

var _filters2 = _interopRequireDefault(_filters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by apkawa on 28.08.16.
 */

var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');

var envs = require('../../../libs/envs');

var cssLoader = function cssLoader() {
  var importLoaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return 'css-loader?modules=true&importLoaders=' + importLoaders;
};
var postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: function plugins() {
      return [require('precss'), require('autoprefixer')];
    }
  }
};

var EXTRA_OPTIONS = {
  hot: true,
  eslint: false,
  providePlugin: {},
  entry_points: {},
  defines: {
    'STATIC_ROOT': '"{{ project.static_root }}"'
  },
  publicPath: '{{ project.static_root }}js/',
  commonChunk: 'common.js',
  extract_css: {
    filename: 'common.css',
    options: {
      allChunks: true
    }
  }
};

var WEBPACK_OPTIONS = {
  cache: true,
  watch: false,
  devtool: 'cheap-module-eval-source-map',
  entry: {},
  output: {
    path: '{{ project.path.dist.js }}',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '{{ webpack.publicPath }}',
    sourceMapFilename: '../_maps/[file].map'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      include: ['{{ project.path.app.js }}'],
      exclude: [/node_modules/, /vendors/],
      loader: 'babel-loader'
    }, {
      test: /\.vue$/,
      use: ['vue-loader']
    }, {
      test: /\.css$/,
      use: ['style-loader', cssLoader(1), postcssLoader]
    }, {
      test: /\.less$/,
      use: ['style-loader', cssLoader(2), postcssLoader, 'less-loader']
    }, {
      test: /\.(scss|sass)$/,
      use: ['style-loader', cssLoader(3), postcssLoader, 'sass-loader', 'import-glob-loader']
    }, {
      test: /\.styl$/,
      use: ['style-loader', cssLoader(1), 'stylus-loader']
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      options: {
        limit: 100000,
        mimetype: 'application/font-woff'
      }
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      options: {
        limit: 100000,
        mimetype: 'application/octet-stream'
      }
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      options: {
        limit: 100000,
        mimetype: 'image/svg+xml'
      }
    }, {
      test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      options: {
        limit: 100000
      }
    }, {
      test: /\.(swig|html)$/,
      loader: 'html-loader'
    }],
    noParse: /\.min\.js/
  },
  resolve: {
    modules: ['{{ project.path.app.js }}', '{{ project.app_root }}', '{{ project.project_root }}', '{{ project.path.node_modules }}'],
    extensions: ['.js', '.jsx'],
    alias: {}
  },
  plugins: [new StringReplacePlugin()],
  node: {
    fs: 'empty',
    file: 'empty',
    directory: 'empty',
    debug: 'empty',
    net: 'empty',
    child_process: 'empty',
    readline: 'empty'
  }
};

function getConfig(config) {
  var webpack_options = _.get(config, 'webpack.config');
  webpack_options.entry = (0, _webpack_entry2.default)(config);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _filters2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var filter = _step.value;

      webpack_options = filter(webpack_options, config);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return webpack_options;
}

exports.default = _extends({
  getConfig: getConfig
}, EXTRA_OPTIONS, {
  config: WEBPACK_OPTIONS
});
module.exports = exports['default'];