'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.productionFilter = productionFilter;
exports.hotFilter = hotFilter;
exports.extractCss = extractCss;
exports.definesFilter = definesFilter;
exports.sassFilter = sassFilter;
exports.bundleAnalyzerFilter = bundleAnalyzerFilter;
exports.providePluginFilter = providePluginFilter;
exports.lodashFilter = lodashFilter;
exports.commonChunkFilter = commonChunkFilter;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _lodashWebpackPlugin = require('lodash-webpack-plugin');

var _lodashWebpackPlugin2 = _interopRequireDefault(_lodashWebpackPlugin);

var _webpackBundleAnalyzer = require('webpack-bundle-analyzer');

var _envs = require('../../../libs/envs');

var _envs2 = _interopRequireDefault(_envs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getProjectWebpack(config) {
  return _lodash2.default.omit(_lodash2.default.get(config, 'webpack', {}), ['getConfig', 'config']);
}

function productionFilter(webpack_options, config) {
  if (!_envs2.default.is_production) {
    return webpack_options;
  }
  return _extends({}, webpack_options, {
    cache: false,
    watch: false,
    devtool: false,
    plugins: [].concat(_toConsumableArray(webpack_options.plugins), [new _webpack2.default.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }), new _webpack2.default.NoEmitOnErrorsPlugin(), new _webpack2.default.optimize.UglifyJsPlugin({
      minimize: true,
      beautify: false,
      comments: false,
      sourceMap: false,
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })])
  });
}

function hotFilter(webpack_options, config) {
  var project_webpack = getProjectWebpack(config);
  if (project_webpack.hot && _envs2.default.debug) {
    webpack_options.devServer = {
      hot: true
    };
    webpack_options.entry = _lodash2.default.fromPairs(_lodash2.default.map(webpack_options.entry, function (f, n) {
      return [n, [f, 'webpack/hot/dev-server', 'webpack-hot-middleware/client']];
    }));
    webpack_options.plugins.push(new _webpack2.default.HotModuleReplacementPlugin());
  }
  return webpack_options;
}

function extractCss(webpack_options, config) {
  var extract_css = _lodash2.default.get(getProjectWebpack(config), 'extract_css');
  if (extract_css) {
    var filename = extract_css.filename,
        options = extract_css.options;


    webpack_options.module.rules = _lodash2.default.map(webpack_options.module.rules, function (o) {
      var test = o.test,
          loaders = o.use;

      if (test.test('.css') || test.test('.less') || test.test('.scss') || test.test('.sass')) {
        var use = _extractTextWebpackPlugin2.default.extract({
          fallback: 'style-loader',
          use: _lodash2.default.map(_lodash2.default.slice(loaders, 1), function (l) {
            return l;
          })
        });
        return {
          test: test, use: use
        };
      }
      return o;
    });
    webpack_options.plugins.push(new _extractTextWebpackPlugin2.default(_extends({ filename: filename }, options)));
  }
  return webpack_options;
}

function definesFilter(webpack_options, config) {
  var defines = _lodash2.default.get(getProjectWebpack(config), 'defines', {});
  webpack_options.plugins.unshift(new _webpack2.default.DefinePlugin(defines));
  return webpack_options;
}
function sassFilter(webpack_options, config) {
  var context = _lodash2.default.get(config, 'project.context');
  if (_lodash2.default.isEmpty(context)) {
    return webpack_options;
  }
  webpack_options.module.rules = _lodash2.default.map(webpack_options.module.rules, function (o) {
    var test = o.test,
        use = o.use,
        _o = _objectWithoutProperties(o, ['test', 'use']);

    if (!(test.test('.scss') || test.test('.sass'))) {
      return o;
    }
    return _extends({
      test: test
    }, _o, {
      use: _lodash2.default.map(use, function (loader) {
        if (_lodash2.default.isString(loader) && loader === 'sass-loader') {
          loader = _extends({
            loader: loader,
            options: {}
          }, _o);
        }
        if (loader.loader === 'sass-loader') {
          var defineData = _lodash2.default.join(_lodash2.default.map(context, function (v, k) {
            return '$' + k + ': ' + JSON.stringify(v) + ';';
          }), '\n;');
          loader.options.data = (loader.options.data || '') + defineData;
        }
        return loader;
      })
    });
  });
  return webpack_options;
}

function bundleAnalyzerFilter(webpack_options, config) {
  var bundleAnalyzerOptions = _lodash2.default.get(getProjectWebpack(config), 'bundle_analyzer');
  if (bundleAnalyzerOptions && env.debug) {
    if (!_lodash2.default.isPlainObject(bundleAnalyzerOptions)) {
      bundleAnalyzerOptions = {};
    }
    webpack_options.plugins.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin(bundleAnalyzerOptions));
  }
  return webpack_options;
}

function providePluginFilter(webpack_options, config) {
  var providePlugin = _lodash2.default.get(getProjectWebpack(config), 'providePlugin', {});
  webpack_options.plugins.push(new _webpack2.default.ProvidePlugin(_extends({}, providePlugin, {
    Promise: 'es6-promise'
  })));
  delete webpack_options.providePlugin;
  return webpack_options;
}

function lodashFilter(webpack_options, config) {
  new _lodashWebpackPlugin2.default(_extends({
    'collections': true,
    'paths': true,
    'shorthands': true
  }, _lodash2.default.get(getProjectWebpack(config), 'lodashPlugin')));
  delete webpack_options.lodashPlugin;
  return webpack_options;
}

function commonChunkFilter(webpack_options, config) {
  var name = _lodash2.default.get(getProjectWebpack(config), 'commonChunk', 'common.js');

  if (name) {
    var opts = name;
    if (_lodash2.default.isString(name)) {
      opts = {
        name: _path2.default.basename(name, '.js'),
        filename: name,
        minChunks: 2
      };
    }
    webpack_options.plugins.push(new _webpack2.default.optimize.CommonsChunkPlugin(opts));
  }
  return webpack_options;
}

exports.default = [productionFilter, hotFilter, definesFilter, sassFilter, providePluginFilter, lodashFilter, commonChunkFilter, extractCss, bundleAnalyzerFilter];