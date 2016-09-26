'use strict';
var gulp = require('gulp');

var options = require('../options');
var browserSyncOptions = options.browserSync;
var browserSync = browserSyncOptions.browserSync;

gulp.task('serve', ['watch'], function () {
    browserSync.init(browserSyncOptions.get_options());
});

module.exports = {
    bs: browserSync,
    stream: () => {
        return browserSync.stream()
    },
    reload: browserSync.reload,
}