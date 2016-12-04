'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var browserSync = require('./browserSync');

    var APP_PATH = config.project.path.app;
    /*
     * Default & Watch tasks
     */

    gulp.task('watch', ['default'], function () {
        gulp.watch(APP_PATH.css + '**/*', ['css', browserSync.reload]);
        gulp.watch(APP_PATH.template + '**/*', ['templates']);
        gulp.watch(APP_PATH.template_context + '**/*', ['templates']);
        gulp.watch(APP_PATH.public, ['public', browserSync.reload]);
        gulp.watch(APP_PATH.js + '**/*', [browserSync.reload]);
    });

    gulp.task('watch:webpack', ['watch', 'webpack:watch']);
};

module.exports = exports['default'];