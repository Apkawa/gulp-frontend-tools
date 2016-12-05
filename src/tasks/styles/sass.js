'use strict';
import path from "path";
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

export default function (gulp, config) {
    const APP_PATH = config.project.path.app;
    const DIST_PATH = config.project.path.dist;

    const sassOpts = config.project.sass;
    const scss_lint_opts = config.project.scss_lint;

    function cssStream(stream) {
        var processors = [
            autoprefixer({browsers: ['last 1 version']}),
        ];
        if (config.envs.is_production) {
            processors.push(cssnano())
        }
        return stream
            .pipe(postcss(processors))
    }

    gulp.task('sass', function () {

        let stream = gulp.src(APP_PATH.scss + '/**/[^_]*.scss')
            .pipe(preprocess({context: config.project.context}))
            .pipe(sourcemaps.init())
            .pipe(sassGlob(sassOpts))
            .pipe(sass(sassOpts).on('error', sass.logError))

        return cssStream(stream)
            .pipe(sourcemaps.write(path.join('..', path.basename(DIST_PATH.source_maps))))
            .pipe(gulp.dest(DIST_PATH.css))
    });

    /*
     * Check CSS
     */
    gulp.task('sass:lint', function () {
        // gem install scss-lint
        return gulp.src(APP_PATH.scss || [APP_PATH.css + '**/[^_]*.scss', '!' + APP_PATH.css + 'base/_reset.scss'])
            .pipe(scsslint(scss_lint_opts))
    });

    gulp.task('css', ['sass']);

}
