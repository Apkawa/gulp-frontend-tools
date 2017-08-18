'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Created by apkawa on 28.08.16.
                                                                                                                                                                                                                                                                   */


var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _stringReplaceWebpackPlugin = require('string-replace-webpack-plugin');

var _stringReplaceWebpackPlugin2 = _interopRequireDefault(_stringReplaceWebpackPlugin);

var _envs = require('../../../libs/envs');

var _envs2 = _interopRequireDefault(_envs);

var _webpack_entry = require('../../../libs/webpack_entry');

var _webpack_entry2 = _interopRequireDefault(_webpack_entry);

var _filters = require('./filters');

var _filters2 = _interopRequireDefault(_filters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cssLoader = function cssLoader() {
  var importLoaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var modules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return {
    loader: 'css-loader',
    query: {
      modules: modules,
      importLoaders: importLoaders,
      sourceMap: true,
      localIdentName: _envs2.default.is_production ? '[hash:base64]' : '[path]__[name]__[local]--[hash:base64:5]'
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
    config: {
      ctx: {
        env: _gulpUtil2.default.env,
        config: function config() {
          return require('../../');
        }
      }
    }
  }
};

var EXTRA_OPTIONS = {
  hot: true,
  gzip: false,
  eslint: false,
  uglify: true,
  babel_minify: false,
  urlLimit: 100000,
  bundle_analyzer: _envs2.default.bundle_analyzer,
  providePlugin: {},
  entry_root: '{{ project.path.app.js }}/entry/',
  entry_points: {},
  defines: {
    'STATIC_ROOT': '"{{ project.static_root }}"',
    'process.env': {
      NODE_ENV: JSON.stringify(_envs2.default.is_production ? 'production' : 'developerment')
    }
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
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },

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
        use: [styleLoader, cssLoader(1, true), postcssLoader]
      }, {
        use: [styleLoader, cssLoader(1), postcssLoader]
      }]
    }, {
      test: /\.less$/,
      oneOf: [{
        resourceQuery: /\?module/,
        use: [styleLoader, cssLoader(2, true), postcssLoader, 'less-loader']
      }, {
        use: [styleLoader, cssLoader(2), postcssLoader, 'less-loader']
      }]
    }, {
      test: /\.(scss|sass)$/,
      oneOf: [{
        resourceQuery: /\?module/,
        use: [styleLoader, cssLoader(3, true), postcssLoader, 'sass-loader', 'import-glob-loader']
      }, {
        use: [styleLoader, cssLoader(3), postcssLoader, {
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
        use: [styleLoader, cssLoader(2, true), postcssLoader, 'stylus-loader']
      }, {
        use: [styleLoader, cssLoader(2), postcssLoader, 'stylus-loader']
      }]

    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      options: {
        limit: '{{ _.urlLimit }}',
        mimetype: 'application/font-woff'
      }
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      options: {
        limit: '{{ _.urlLimit }}',
        mimetype: 'application/octet-stream'
      }
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader',
      options: {
        limit: '{{ _.urlLimit }}',
        mimetype: 'image/svg+xml'
      }
    }, {
      test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: '{{ _.urlLimit }}',
          name: 'images/[name].[hash:7].[ext]'
        }
      }]
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
  plugins: [new _stringReplaceWebpackPlugin2.default()],
  node: {
    fs: 'empty',
    file: 'empty',
    directory: 'empty',
    debug: 'empty',
    net: 'empty',
    child_process: 'empty'
  }
};

var __COMPILED = void 0;

function getConfig(config) {
  if (__COMPILED) {
    return __COMPILED;
  }
  var webpack_options = _lodash2.default.get(config, 'webpack.config');
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