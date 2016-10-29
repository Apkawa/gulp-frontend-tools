'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    //var cssStream = require('./styles/sass');


    var APP_PATH = config.project.path.app;
    var DIST_PATH = config.project.path.dist;
    var DIST_ROOT = config.project.dist_root;

    var isProduction = config.envs.is_production;

    var imgFilter = filter('**/*.+(png|gif|jpeg|jpg|svg)', { restore: true });
    var cssFilter = filter(['**/*.css', '!**/*.min.css'], { restore: true });
    var jsFilter = filter(['**/*.js', '!**/*.min.js'], { restore: true });

    gulp.task('public', function () {
        var streams = _.map(APP_PATH.public, function (public_root) {

            var stream = gulp.src(path.join(public_root, '/**/*'), { base: public_root }).pipe(imgFilter).pipe(gulpif(isProduction, imagemin({ verbose: true }))).pipe(size({ showFiles: true, gzip: true })).pipe(imgFilter.restore);

            stream = stream.pipe(jsFilter).pipe(sourcemaps.init()).pipe(gulpif(isProduction, uglify())).pipe(sourcemaps.write(path.join(path.basename(DIST_PATH.source_maps)))).pipe(size({ showFiles: true, gzip: true })).pipe(jsFilter.restore);

            /*
            TODO get css stream
             stream = cssStream(
             stream.pipe(cssFilter).pipe(sourcemaps.init())
             )
             .pipe(sourcemaps.write(path.join(path.basename(DIST_PATH.source_maps))))
             .pipe(size({showFiles: true, gzip: true}))
             .pipe(cssFilter.restore)
             */

            return stream.pipe(gulpif('**/*.+(css|js)', gzip({ threshold: '1kb' }))).pipe(gulp.dest(DIST_ROOT));
        });
        return merge(streams);
    });
};

var _ = require('lodash');
var path = require('path');

var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');

var gzip = require('gulp-gzip');
var size = require('gulp-size');

var merge = require('merge-stream');
var filter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');

module.exports = exports['default'];