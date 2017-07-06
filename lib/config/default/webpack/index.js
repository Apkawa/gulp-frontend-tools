'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack_entry = require('../../../libs/webpack_entry');

var _webpack_entry2 = _interopRequireDefault(_webpack_entry);

var _filters = require('./filters');

var _filters2 = _interopRequireDefault(_filters);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _precss = require('precss');

var _precss2 = _interopRequireDefault(_precss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by apkawa on 28.08.16.
 */

var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');

var envs = require('../../../libs/envs');
console.log(envs);

var cssLoader = function cssLoader() {
  var importLoaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var modules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return {
    loader: 'css-loader',
    query: {
      modules: modules,
      importLoaders: importLoaders,
      sourceMap: true,
      localIdentName: envs.is_production ? '[hash:base64]' : '[path]__[name]__[local]--[hash:base64:5]'
    }
  };
};
var styleLoader = {
  loader: 'style-loader',
  options: {
    sourceMap: true
  }
};

var postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    plugins: []
  }
};

var EXTRA_OPTIONS = {
  hot: true,
  gzip: false,
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
      exclude: [/node_modules/, /vendors/],
      loader: 'babel-loader'
    }, {
      test: /\.vue$/,
      use: ['vue-loader']
    }, {
      test: /\.css$/,
      oneOf: [{
        resourceQuery: /\?module/,
        use: [styleLoader, cssLoader(0, true)]
      }, {
        use: [styleLoader, cssLoader(0)]
      }]
    }, {
      test: /\.less$/,
      oneOf: [{
        resourceQuery: /\?module/,
        use: [styleLoader, cssLoader(1, true), 'less-loader']
      }, {
        use: [styleLoader, cssLoader(1), 'less-loader']
      }]
    }, {
      test: /\.(scss|sass)$/,
      oneOf: [{
        resourceQuery: /\?module/,
        use: [styleLoader, cssLoader(2, true), 'sass-loader', 'import-glob-loader']
      }, {
        use: [styleLoader, cssLoader(2), {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }, 'import-glob-loader']

      }]
    }, {
      test: /\.styl$/,
      oneOf: [{
        resourceQuery: /\?module/,
        use: [styleLoader, cssLoader(1, true), 'stylus-loader']
      }, {
        use: [styleLoader, cssLoader(1), 'stylus-loader']
      }]

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

var __COMPILED = void 0;

function getConfig(config) {
  if (__COMPILED) {
    return __COMPILED;
  }
  var webpack_options = _.get(config, 'webpack.config');
  webpack_options.entry = (0, _webpack_entry2.default)(config);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _filters2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var filter = _step.value;

      try {
        webpack_options = filter(webpack_options, config);
      } catch (err) {
        throw err;
      }
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

  __COMPILED = webpack_options;
  return webpack_options;
}

exports.default = _extends({
  getConfig: getConfig
}, EXTRA_OPTIONS, {
  config: WEBPACK_OPTIONS
});
module.exports = exports['default'];