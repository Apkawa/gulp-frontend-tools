'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    gulp.task('default', ['public', 'css', 'webpack']);
    gulp.task('print-config', function () {
        console.log((0, _jsObjectPrettyPrint.pretty)(config));
    });
};

var _jsObjectPrettyPrint = require('js-object-pretty-print');

var gulp = require('gulp');

module.exports = exports['default'];