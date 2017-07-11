'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  var modify_rules = function modify_rules(loaders) {
    var opts = {
      fallback: loaders[0],
      use: _lodash2.default.map(_lodash2.default.slice(loaders, 1), function (l) {
        return l;
      })
    };
    return _extractTextWebpackPlugin2.default.extract(opts);
  };
  var extract_css = _lodash2.default.get(getProjectWebpack(config), 'extract_css');
  if (!extract_css) {
    return webpack_options;
  }

  var _extract_css$filename = extract_css.filename,
      filename = _extract_css$filename === undefined ? '/common.css' : _extract_css$filename,
      _extract_css$options = extract_css.options,
      options = _extract_css$options === undefined ? {} : _extract_css$options;


  webpack_options.module.rules = _lodash2.default.map(webpack_options.module.rules, function (loader_rule) {
    var test = loader_rule.test,
        loaders = loader_rule.use,
        oneOf = loader_rule.oneOf,
        rules = loader_rule.rules;


    if (test.test('.css') || test.test('.less') || test.test('.scss') || test.test('.sass') || test.test('.styl')) {
      var _ref = _lodash2.default.filter(_lodash2.default.map({ oneOf: oneOf, rules: rules }, function (v, k) {
        return v ? [k, v] : v;
      }))[0] || [undefined, undefined],
          _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          subRules = _ref2[1];

      if (key) {
        return _defineProperty({
          test: test
        }, key, _lodash2.default.map(subRules, function (_ref3) {
          var use = _ref3.use,
              _l = _objectWithoutProperties(_ref3, ['use']);

          return _extends({ use: modify_rules(use) }, _l);
        }));
      }
      return {
        test: test, use: modify_rules(loaders)
      };
    }
    return loader_rule;
  });
  webpack_options.plugins.push(new _extractTextWebpackPlugin2.default(_extends({
    filename: filename,
    allChunks: true
  }, options)));
  return webpack_options;
}

function definesFilter(webpack_options, config) {
  var defines = _lodash2.default.get(getProjectWebpack(config), 'defines', {});
  webpack_options.plugins.unshift(new _webpack2.default.DefinePlugin(defines));
  return webpack_options;
}
function sassFilter(webpack_options, config) {
  var updateLoaders = function updateLoaders(loader) {
    if (_lodash2.default.isArray(loader)) {
      return _lodash2.default.map(loader, updateLoaders);
    }
    if (_lodash2.default.isString(loader) && loader === 'sass-loader') {
      loader = {
        loader: loader,
        options: {}
      };
    }
    if (loader.loader === 'sass-loader') {
      var defineData = _lodash2.default.join(_lodash2.default.map(context, function (v, k) {
        return '$' + k + ': ' + JSON.stringify(v) + ';';
      }), '\n;');
      loader.options.data = (loader.options.data || '') + defineData;
    }
    return loader;
  };

  var context = _lodash2.default.get(config, 'context');
  if (_lodash2.default.isEmpty(context)) {
    return webpack_options;
  }
  webpack_options.module.rules = _lodash2.default.map(webpack_options.module.rules, function (o) {
    var test = o.test,
        use = o.use,
        oneOf = o.oneOf,
        rules = o.rules,
        _o = _objectWithoutProperties(o, ['test', 'use', 'oneOf', 'rules']);

    if (!(test.test('.scss') || test.test('.sass'))) {
      return o;
    }

    var _ref5 = _lodash2.default.filter(_lodash2.default.map({ oneOf: oneOf, rules: rules }, function (v, k) {
      return v ? [k, v] : v;
    }))[0] || [undefined, undefined],
        _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        _rules = _ref6[1];

    console.log(key, rules);
    if (key) {
      return _extends({
        test: test
      }, _o, _defineProperty({}, key, _lodash2.default.map(_rules, function (_ref7) {
        var use = _ref7.use,
            r = _objectWithoutProperties(_ref7, ['use']);

        return _extends({ use: updateLoaders(use) }, r);
      })));
    }
    console.log(_o);
    return _extends({
      test: test
    }, _o, {
      use: updateLoaders(use)
    });
  });
  return webpack_options;
}

function bundleAnalyzerFilter(webpack_options, config) {
  var bundleAnalyzerOptions = _lodash2.default.get(getProjectWebpack(config), 'bundle_analyzer');
  console.log(bundleAnalyzerOptions);
  if (bundleAnalyzerOptions) {
    if (!_lodash2.default.isPlainObject(bundleAnalyzerOptions)) {
      bundleAnalyzerOptions = {};
    }
    webpack_options.plugins.push(new _webpackBundleAnalyzer.BundleAnalyzerPlugin(bundleAnalyzerOptions));
  }
  return webpack_options;
}

function providePluginFilter(webpack_options, config) {
  var providePlugin = _lodash2.default.get(getProjectWebpack(config), 'providePlugin', {});
  webpack_options.plugins.push(new _webpack2.default.ProvidePlugin(_extends({}, providePlugin)));
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
  config = _lodash2.default.get(getProjectWebpack(config), 'commonChunk', 'common.js');
  if (!config) {
    return webpack_options;
  }
  if (_lodash2.default.isString(config)) {
    config = {
      name: _path2.default.basename(config, '.js'),
      filename: config,
      minChunks: 2
    };
  }

  webpack_options.plugins.push(new _webpack2.default.optimize.CommonsChunkPlugin(config));
  return webpack_options;
}

exports.default = [productionFilter, hotFilter, definesFilter, sassFilter, providePluginFilter, lodashFilter, commonChunkFilter, extractCss, bundleAnalyzerFilter];