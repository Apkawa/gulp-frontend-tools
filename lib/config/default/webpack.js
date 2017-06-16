/**
 * Created by apkawa on 28.08.16.
 */

'use strict';

var _webpack_entry = require('../../libs/webpack_entry');

var _webpack_entry2 = _interopRequireDefault(_webpack_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var envs = require('../../libs/envs');

var eslint_options = {
  configFile: '{{ project.eslint.configFile }}',

  preLoaders: [{ test: /\.jsx?$/, loaders: ['eslint-loader', 'source-map-loader'], exclude: /node_modules/ }]
};

var css_loader = function css_loader() {
  var importLoaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return 'css-loader?importLoaders=' + importLoaders;
};

var webpack_options = {
  cache: true,
  debug: true,
  watch: false,
  devtool: 'source-map',
  devServer: {
    hot: true
  },
  entry: {},
  output: {
    path: '{{ project.path.dist.js }}',
    filename: '[name].js',
    publicPath: '{{ project.webpack.publicPath }}',
    sourceMapFilename: '../_maps/[file].map'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: [/node_modules/, /vendors/],
      loader: 'babel',
      query: {
        presets: ['react', 'es2015'],
        plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-object-rest-spread']
      }
    }, {
      test: /\.vue$/,
      loaders: ['vue-loader']
    }, {
      test: /\.css$/,
      loaders: ['style-loader', css_loader(1), 'postcss-loader']

    }, {
      test: /\.less$/,
      loaders: ['style-loader', css_loader(2), 'postcss-loader', 'less-loader']
    }, {
      test: /\.(scss|sass)$/,
      loaders: ['style-loader', css_loader(3), 'postcss-loader', 'sass-loader', 'import-glob-loader']
    }, {
      test: /\.styl$/,
      loaders: ['style-loader', css_loader(1), 'stylus-loader']
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=100000&mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=100000&mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=100000&mimetype=image/svg+xml'
    }, {
      test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=100000'
    }, {
      test: /\.(swig|html)$/,
      loader: 'html'
    }, {
      test: /\.json$/,
      loader: 'json'
    }],
    noParse: /\.min\.js/
  },
  resolve: {
    root: [],
    modulesDirectories: ['{{ project.path.app.js }}', '{{ project.app_root }}', '{{ project.project_root }}', '{{ project.path.node_modules }}'],
    extensions: ['', '.js', '.jsx'],
    alias: {}
  },

  plugins: [new webpack.ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    _: 'lodash',
    Promise: 'es6-promise'
  }), new StringReplacePlugin(), new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'commons.js',
    minChunks: 3
  }), new webpack.HotModuleReplacementPlugin()],
  node: {
    fs: 'empty',
    file: 'empty',
    directory: 'empty',
    debug: 'empty',
    net: 'empty'
  },
  postcss: function postcss() {
    return [require('precss'), require('autoprefixer'), require('cssnano')];
  }
};

var webpack_options_production = _.assign({}, _.cloneDeep(webpack_options), {
  cache: false,
  debug: false,
  watch: false,
  devtool: null,
  plugins: [].concat(_toConsumableArray(webpack_options.plugins), [
  //https://habrahabr.ru/post/308926/
  // new LodashModuleReplacementPlugin({
  //   'collections': true,
  //   'shorthands': true,
  // }),
  new webpack.NoErrorsPlugin(), new webpack.optimize.DedupePlugin(), new webpack.optimize.OccurrenceOrderPlugin(), new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    beautify: false,
    comments: false,
    sourceMap: true,
    compress: {
      warnings: false,
      drop_console: true,
      unsafe: true
    }
  })])
});

if (envs.is_production) {
  webpack_options = webpack_options_production;
}

function getOptions(config) {
  var webpack_options = config.webpack.options,
      context = config.project.context;

  var project_webpack = _.get(config, 'project.webpack', {});
  var defines = _.get(config, 'project.webpack.defines', {});

  webpack_options.entry = (0, _webpack_entry2.default)(config);
  if (project_webpack.hot && envs.debug) {
    webpack_options.entry = _.fromPairs(_.map(webpack_options.entry, function (f, n) {
      return [n, [f, 'webpack/hot/dev-server', 'webpack-hot-middleware/client']];
    }));
  }

  if (project_webpack.extract_css) {
    var _project_webpack$extr = project_webpack.extract_css,
        filename = _project_webpack$extr.filename,
        options = _project_webpack$extr.options;

    webpack_options.module.loaders = _.map(webpack_options.module.loaders, function (o) {
      var test = o.test,
          loaders = o.loaders;

      if (test.test('.css') || test.test('.less') || test.test('.scss') || test.test('.sass')) {
        return {
          test: test, loader: ExtractTextPlugin.extract('style-loader', _.map(_.slice(loaders, 1), function (l) {
            return l;
          }))
        };
      }
      return o;
    });

    webpack_options.plugins.push(new ExtractTextPlugin(filename, options));
  }

  /*    webpack_options.resolve.modulesDirectories = [
   ...webpack_options.resolve.modulesDirectories,
   ...extra_modules,
   ]*/

  webpack_options.plugins.unshift(new webpack.DefinePlugin(defines));
  if (project_webpack.eslint) {
    webpack_options.eslint = { configFile: eslint_options.configFile };
    webpack_options.module.preLoaders = eslint_options.preLoaders;
  }

  if (context) {
    var sassLoader = _.get(webpack_options, 'sassLoader.data') || '';
    webpack_options.sassLoader = {
      data: sassLoader + _.join(_.map(context, function (v, k) {
        return '$' + k + ': ' + JSON.stringify(v) + ';';
      }), '\n;')
    };
  }
  if (project_webpack.bundle_analyzer) {
    var _options = project_webpack.bundle_analyzer;
    if (!_.isPlainObject(_options)) {
      _options = {};
    }
    webpack_options.plugins.push(new BundleAnalyzerPlugin(_options));
  }
  return webpack_options;
}

module.exports = {
  getOptions: getOptions,
  options: webpack_options
};