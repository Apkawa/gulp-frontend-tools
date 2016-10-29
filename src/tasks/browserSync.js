'use strict';
var gulp = require('gulp');

export default function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    gulp.task('serve', ['watch', 'templates'], function () {
        browserSync.init(browserSyncOptions.get_options());
    });

}

