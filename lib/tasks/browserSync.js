'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var _config$browserSync = config.browserSync,
        getBSConfig = _config$browserSync.getBSConfig,
        browserSync = _config$browserSync.browserSync;


    gulp.task('serve', ['watch', 'templates'], function () {
        browserSync.init(getBSConfig(config));
    });
};

module.exports = exports['default'];