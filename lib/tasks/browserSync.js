'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    gulp.task('serve', ['watch', 'templates'], function () {
        browserSync.init(browserSyncOptions.get_options(config));
    });
};

var gulp = require('gulp');

module.exports = exports['default'];