import _ from "lodash";
var url = require('url');
var path = require('path');
var proxy = require('proxy-middleware');
var stripAnsi = require('strip-ansi');
var browserSync = require('browser-sync').create();


/* Webpack */
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');

import webpackEntry from "../../libs/webpack_entry";


function buildProxyList(proxyObject) {
    return _.map(proxyObject, function (v, k) {
        var proxyOptions = url.parse(v);
        proxyOptions.route = k;
        return proxy(proxyOptions);
    });


}

function getWebpackMiddleware(publicPath, webpackConfig) {
    const bundler = webpack(webpackConfig);
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
        stats: {colors: true},
    })

}


function getBSOptions(options) {
    var webpack_options = options.webpack;
    webpack_options.entry = webpackEntry(options);

    var project = options.project;

    var bs_options = {
        open: true,
        startPath: "",
        browser: 'google-chrome',
        server: {
            baseDir: project.dist_root,
            routes: {},
            middleware: [
                ...buildProxyList(_.get(project, 'browserSync.proxy', {})),
                getWebpackMiddleware(_.get(project, 'browserSync.webpack.public_path'), webpack_options)
            ],
        },
        plugins: [
            'bs-fullscreen-message'
        ]
    };
    bs_options.server.routes[project.static_root] = project.dist_root;

    bs_options = _.merge({}, bs_options, _.get(project, 'browserSync.options', {}));
    return bs_options
}

module.exports = {
    get_options: getBSOptions,
    browserSync: browserSync,
};

