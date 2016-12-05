'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var APP_PATH = config.project.path.app;
    var DIST_PATH = config.project.path.dist;

    var sassOpts = config.project.sass;
    var scss_lint_opts = config.project.scss_lint;

    function cssStream(stream) {
        var processors = [autoprefixer({ browsers: ['last 1 version'] })];
        if (config.envs.is_production) {
            processors.push(cssnano());
        }
        return stream.pipe(postcss(processors));
    }

    gulp.task('sass', function () {

        var stream = gulp.src(APP_PATH.scss + '/**/[^_]*.scss').pipe(preprocess({ context: config.project.context })).pipe(sourcemaps.init()).pipe(sassGlob(sassOpts)).pipe(sass(sassOpts).on('error', sass.logError));

        return cssStream(stream).pipe(sourcemaps.write(_path2.default.join('..', _path2.default.basename(DIST_PATH.source_maps)))).pipe(gulp.dest(DIST_PATH.css));
    });

    /*
     * Check CSS
     */
    gulp.task('sass:lint', function () {
        // gem install scss-lint
        return gulp.src(APP_PATH.scss || [APP_PATH.css + '**/[^_]*.scss', '!' + APP_PATH.css + 'base/_reset.scss']).pipe(scsslint(scss_lint_opts));
    });

    gulp.task('css', ['sass']);
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var postcss = require('gulp-postcss');
var gulpif = require('gulp-if');
var preprocess = require('gulp-preprocess');
var sourcemaps = require('gulp-sourcemaps');

module.exports = exports['default'];