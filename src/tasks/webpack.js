'use strict';
var _ = require('lodash')
var gutil = require('gulp-util');
var path = require('path');
var webpack = require("webpack");
import webpackEntry from "../libs/webpack_entry";


export default function (gulp, config) {
    var webpack_options = config.webpack;
    webpack_options.entry = webpackEntry(config);

    console.log(webpack_options.entry)
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
