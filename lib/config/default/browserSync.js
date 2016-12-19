"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _proxyMiddleware = require("proxy-middleware");

var _proxyMiddleware2 = _interopRequireDefault(_proxyMiddleware);

var _stripAnsi = require("strip-ansi");

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

var _browserSync = require("browser-sync");

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require("webpack-dev-middleware");

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require("webpack-hot-middleware");

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
/* Webpack */


var browserSync = (0, _browserSync.create)();

function buildProxyList(proxyObject) {
    return _lodash2.default.map(proxyObject, function (v, k) {
        var proxyOptions = _url2.default.parse(v);
        proxyOptions.route = k;
        return (0, _proxyMiddleware2.default)(proxyOptions);
    });
}

function getWebpackMiddlewares(webpackConfig) {
    var publicPath = webpackConfig.output.publicPath;
    var bundler = (0, _webpack2.default)(webpackConfig);
    bundler.plugin('done', function (stats) {
        if (stats.hasErrors() || stats.hasWarnings()) {
            return browserSync.sockets.emit('fullscreen:message', {
                title: "Webpack Error:",
                body: (0, _stripAnsi2.default)(stats.toString()),
                timeout: 100000
            });
        }
        //browserSync.reload();
    });

    return [(0, _webpackDevMiddleware2.default)(bundler, {
        publicPath: publicPath,
        stats: { colors: true }
    }), (0, _webpackHotMiddleware2.default)(bundler)];
}

function getBSOptions(options) {
    var webpack_options = options.webpack.getOptions(options);

    var project = options.project;

    var bs_options = {
        open: true,
        startPath: "",
        browser: 'google-chrome',
        server: {
            baseDir: project.dist_root,
            routes: {},
            middleware: [].concat(_toConsumableArray(buildProxyList(_lodash2.default.get(project, 'browserSync.proxy', {}))), _toConsumableArray(getWebpackMiddlewares(webpack_options)))
        },
        plugins: []
    };
    bs_options.server.routes[project.static_root] = project.dist_root;

    bs_options = _lodash2.default.merge({}, bs_options, _lodash2.default.get(project, 'browserSync.options', {}));
    return bs_options;
}

module.exports = {
    get_options: getBSOptions,
    browserSync: browserSync
};