import _ from "lodash";
var url = require('url');
var path = require('path');
var proxy = require('proxy-middleware');
var stripAnsi = require('strip-ansi');
var browserSync = require('browser-sync').create();


/* Webpack */
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');


function buildProxyList(proxyObject) {
    return _.map(proxyObject, function (v, k) {
        var proxyOptions = url.parse(v);
        proxyOptions.route = k;
        return proxy(proxyOptions);
    });


}

function getWebpackMiddleware(publicPath, webpackConfig) {
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
    console.log(publicPath)

    return webpackDevMiddleware(bundler, {
        publicPath: publicPath,
        stats: {colors: true},
    })

}


function getBSOptions() {
    var webpackConfig = require('../../tasks/webpack');

    var options = require('../').project;


    var bs_options = {
        open: true,
        startPath: "",
        browser: 'google-chrome',
        server: {
            baseDir: options.dist_root,
            routes: {},
            middleware: [
                ...buildProxyList(_.get(options, 'browserSync.proxy', {})),
                getWebpackMiddleware(_.get(options, 'browserSync.webpack.public_path'), webpackConfig)
            ],
        },
        plugins: [
            'bs-fullscreen-message'
        ]
    };
    bs_options.server.routes[options.static_root] = options.dist_root;

    bs_options = _.merge({}, bs_options, _.get(options, 'browserSync.options', {}));
    return bs_options
}

module.exports = {
    get_options: getBSOptions,
    browserSync: browserSync,
};

