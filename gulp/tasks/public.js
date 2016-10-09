'use strict';
var _ = require('lodash')
var path = require('path');

var gulp = require('gulp');

var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');

var gzip = require('gulp-gzip');
var size = require('gulp-size');

var merge = require('merge-stream');
var filter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');

var options = require('../options');

var cssStream = require('./styles/sass');


var APP_PATH = options.project.path.app;
var DIST_PATH = options.project.path.dist;
var DIST_ROOT = options.project.dist_root;

const isProduction = options.envs.is_production;

const imgFilter = filter('**/*.+(png|gif|jpeg|jpg|svg)', {restore: true})
const cssFilter = filter(['**/*.css', '!**/*.min.css'], {restore: true})
const jsFilter = filter(['**/*.js', '!**/*.min.js'], {restore: true})

gulp.task('public', function () {
    let streams = _.map(APP_PATH.public, (public_root) => {

        let stream = gulp.src(path.join(public_root, '/**/*'), {base: public_root})
            .pipe(imgFilter)
            .pipe(gulpif(isProduction, imagemin({verbose: true})))
            .pipe(size({showFiles: true, gzip: true}))
            .pipe(imgFilter.restore)

        stream = stream
            .pipe(jsFilter)
            .pipe(sourcemaps.init())
            .pipe(gulpif(isProduction, uglify()))
            .pipe(sourcemaps.write(path.join(path.basename(DIST_PATH.source_maps))))
            .pipe(size({showFiles: true, gzip: true}))
            .pipe(jsFilter.restore)


        stream = cssStream(stream.pipe(cssFilter).pipe(sourcemaps.init()))
            .pipe(sourcemaps.write(path.join(path.basename(DIST_PATH.source_maps))))
            .pipe(size({showFiles: true, gzip: true}))
            .pipe(cssFilter.restore)

        return stream.pipe(gulpif('**/*.+(css|js)', gzip({threshold: '1kb',})))
            .pipe(gulp.dest(DIST_ROOT))
    });
    return merge(streams)
})
