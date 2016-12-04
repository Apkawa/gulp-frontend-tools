"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _webpack_entry = require("../../libs/webpack_entry");

var _webpack_entry2 = _interopRequireDefault(_webpack_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var url = require('url');
var path = require('path');
var proxy = require('proxy-middleware');
var stripAnsi = require('strip-ansi');
var browserSync = require('browser-sync').create();

/* Webpack */
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');

function buildProxyList(proxyObject) {
    return _lodash2.default.map(proxyObject, function (v, k) {
        var proxyOptions = url.parse(v);
        proxyOptions.route = k;
        return proxy(proxyOptions);
    });
}

function getWebpackMiddleware(webpackConfig) {
    var publicPath = webpackConfig.output.publicPath;
    var bundler = webpack(webpackConfig);
    bundler.plugin('done', function (stats) {
        if (stats.hasErrors() || stats.hasWarnings()) {
            return browserSync.sockets.emit('fullscreen:message', {
                title: "Webpack Error:",
                body: stripAnsi(stats.toString()),
                timeout: 100000
            });
        }
        browserSync.reload();
    });

    return webpackDevMiddleware(bundler, {
        publicPath: publicPath,
        stats: { colors: true }
    });
}

function getBSOptions(options) {
    var webpack_options = options.webpack;
    webpack_options.entry = (0, _webpack_entry2.default)(options);

    var project = options.project;

    var bs_options = {
        open: true,
        startPath: "",
        browser: 'google-chrome',
        server: {
            baseDir: project.dist_root,
            routes: {},
            middleware: [].concat(_toConsumableArray(buildProxyList(_lodash2.default.get(project, 'browserSync.proxy', {}))), [getWebpackMiddleware(webpack_options)])
        },
        plugins: ['bs-fullscreen-message']
    };
    bs_options.server.routes[project.static_root] = project.dist_root;

    bs_options = _lodash2.default.merge({}, bs_options, _lodash2.default.get(project, 'browserSync.options', {}));
    return bs_options;
}

module.exports = {
    get_options: getBSOptions,
    browserSync: browserSync
};