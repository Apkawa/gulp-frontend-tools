'use strict';
var _ = require('lodash')
var gutil = require('gulp-util');
var path = require('path');
var webpack = require("webpack");
import collect_filenames from "../libs/collect_filenames";

export default function (gulp, config) {
    var project = config.project;
    var webpack_options = config.webpack;

    function getWebpackEntry() {
        var ENTRY_ROOT = project.path.app.webpack_entry_root || path.join(project.path.app.js, 'entry');
        var entryPoints = collect_filenames(ENTRY_ROOT, '**/*.js?(x)');
        return _.merge({},
            entryPoints,
            webpack_options.entry);
    }

    webpack_options.entry = getWebpackEntry();

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
