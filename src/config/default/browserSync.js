import _ from "lodash";
import url from "url";
import proxy from "proxy-middleware";
import stripAnsi from "strip-ansi";
import {create} from "browser-sync";
/* Webpack */
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

const browserSync = create();


function buildProxyList(proxyObject) {
    return _.map(proxyObject, function (v, k) {
        let proxyOptions = url.parse(v);
        proxyOptions.route = k;
        return proxy(proxyOptions);
    });


}

function getWebpackMiddlewares(webpackConfig) {
    const publicPath = webpackConfig.output.publicPath;
    const bundler = webpack(webpackConfig);
    bundler.plugin('done', function (stats) {
        if (stats.hasErrors() || stats.hasWarnings()) {
            return browserSync.sockets.emit('fullscreen:message', {
                title: "Webpack Error:",
                body: stripAnsi(stats.toString()),
                timeout: 100000
            });
        }
        //browserSync.reload();
    });

    return [webpackDevMiddleware(bundler, {
        publicPath,
        stats: {colors: true},
    }),
        webpackHotMiddleware(bundler),
    ]

}


function getBSOptions(options) {
    options.project.webpack.extract_css = false;
    const webpack_options = options.webpack.getOptions(options);

    const project = options.project;

    let bs_options = {
        open: true,
        startPath: "",
        browser: 'google-chrome',
        server: {
            baseDir: project.dist_root,
            routes: {},
            middleware: [
                ...buildProxyList(_.get(project, 'browserSync.proxy', {})),
                ...getWebpackMiddlewares(webpack_options)
            ],
        },
        plugins: []
    };
    bs_options.server.routes[project.static_root] = project.dist_root;

    bs_options = _.merge({}, bs_options, _.get(project, 'browserSync.options', {}));
    return bs_options
}

module.exports = {
    get_options: getBSOptions,
    browserSync: browserSync,
};

