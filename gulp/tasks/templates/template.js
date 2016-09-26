'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util')
var _ = require('lodash');
var rename = require("gulp-rename");
var nunjucksRender = require('gulp-nunjucks-render');

var path = require('path');
var data = require('gulp-data');
var plumber = require('gulp-plumber');
var ignore = require('gulp-ignore');
var debug = require('gulp-debug');


var options = require('../../options');
var browserSync = require('../browserSync')
var loadData = require('../../libs/load_data');

var template_options = options.template;

var TEMPLATE_ROOT = options.project.template.root;
var CONTEXT_ROOT = options.project.template.context;
var APP_ROOT = options.project.app_root;
var DIST_ROOT = options.project.dist_root;

var getJsonData = function (file) {
    var parsed = path.parse(path.normalize(file.path));
    var dirname = _.slice(parsed.dir, path.normalize(TEMPLATE_ROOT).length).join('');
    dirname = dirname.replace('_jinja', '')
    var name = path.join(dirname, parsed.name);

    return loadData(name, CONTEXT_ROOT);
};

var ignoreTemplate = function (file) {
    /* ignore partials like sass */
    var parts = _.filter(file.path.split('/'), function (part) {
        return part.startsWith("_")
    })
    if (parts.length) {
        return true
    }
}
function errorHandler(err) {
    if (err) {
        // TODO bs-fullscreen
    }
    gutil.log(
        gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'),
        err.toString()
    );

}
gulp.task('templates:jinja2', function () {

    return gulp.src(TEMPLATE_ROOT + '/**/*.{jinja2,html,j2}', {base: APP_ROOT})
        .pipe(ignore.exclude(ignoreTemplate))
        .pipe(debug({title: "template"}))
        .pipe(data(getJsonData))
        .pipe(plumber(errorHandler))
        .pipe(nunjucksRender(template_options))
        .pipe(plumber.stop())
        .pipe(gulp.dest(DIST_ROOT))
        .pipe(browserSync.stream())
});


