'use strict';
var _ = require('lodash')
var gutil = require('gulp-util');
var path = require('path');
var webpack = require("webpack");


export default function (gulp, config) {

    const webpack_options = config.webpack.getOptions(config);

    gulp.task('webpack:watch', function (callback) {
        webpack_options.watch = true;
        webpack(webpack_options,
            function (err, stats) {
                if (err) {
                    throw new gutil.PluginError("webpack", err);
                }
                gutil.log("[webpack]", stats.toString({
                    colors: true,
                    reasons: true,
                }));
                gutil.log("[webpack]", gutil.colors.green('Done...'))
            })
    });

    gulp.task('webpack', function (callback) {
        webpack(webpack_options,
            function (err, stats) {
                if (err) {
                    throw new gutil.PluginError("webpack", err);
                }
                gutil.log("[webpack]", stats.toString({
                    colors: true,
                    reasons: true,
                }));
                callback();
            })
    });

}
