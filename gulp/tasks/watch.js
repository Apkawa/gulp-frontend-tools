'use strict';
var gulp = require('gulp');

var options = require('../options').project;
var browserSync = require('./browserSync')

var APP_PATH = options.path.app;
/*
 * Default & Watch tasks
 */
gulp.task('watch', ['default'], function () {
    gulp.watch(APP_PATH.css + '**/*.{scss,css}', ['css', browserSync.reload]);
    gulp.watch(APP_PATH.template, ['templates',]);
    gulp.watch(APP_PATH.template_context, ['templates',]);
    gulp.watch(APP_PATH.public, ['public', browserSync.reload]);
    gulp.watch(APP_PATH.js, [browserSync.reload]);
});

gulp.task('watch:webpack', ['watch', 'webpack:watch']);
