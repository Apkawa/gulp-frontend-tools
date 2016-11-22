'use strict';
var gutil = require('gulp-util');
var _ = require('lodash');
var rename = require("gulp-rename");
var nunjucksRender = require('gulp-nunjucks-render');

var path = require('path');
var data = require('gulp-data');
var plumber = require('gulp-plumber');
var ignore = require('gulp-ignore');
var debug = require('gulp-debug');


var loadData = require('../../libs/load_data');

import ignoreTemplate  from '../../libs/ignore_template'


export default function (gulp, config) {
    const browserSyncOptions = config.browserSync;
    const browserSync = browserSyncOptions.browserSync;

    const template_options = config.template;

    const TEMPLATE_ROOT = config.project.template.root;
    const CONTEXT_ROOT = config.project.template.context;
    const APP_ROOT = config.project.app_root;
    const DIST_ROOT = config.project.dist_root;

    const getJsonData = function (file) {
        const parsed = path.parse(path.normalize(file.path));
        let dirname = _.slice(parsed.dir, path.normalize(TEMPLATE_ROOT).length).join('');
        dirname = dirname.replace('_jinja', '')
        const name = path.join(dirname, parsed.name);

        return loadData(name, CONTEXT_ROOT);
    };


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
}
