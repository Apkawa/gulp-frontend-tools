'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var DIST_ROOT = config.project.dist_root;


    gulp.task('clean', function () {
        gulp.src(DIST_ROOT, { read: false }).pipe(clean({ force: true }));
    });
};

var clean = require('gulp-clean');

module.exports = exports['default'];