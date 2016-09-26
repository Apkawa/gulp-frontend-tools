'use strict';
var gulp = require('gulp');
var clean = require('gulp-clean');

var options = require('../options');

gulp.task('clean', function () {
    gulp.src(options.project.dist_root, {read: false})
        .pipe(clean({force: true}))

})
