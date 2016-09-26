'use strict';
var gulp = require('gulp');

var options = require('../options');
var APP_PATH = options.project.path.app;
var DIST_ROOT = options.project.dist_root

// TODO image optimizations

gulp.task('public', function () {
    gulp.src(APP_PATH.public, {base: APP_PATH.public_root})
        .pipe(gulp.dest(DIST_ROOT))
})
