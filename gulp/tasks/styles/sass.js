'use strict';
import path from 'path'
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


var options = require('../../options');


const APP_PATH = options.project.path.app;
const DIST_PATH = options.project.path.dist;

const sassOpts = options.project.sass;

export default function cssStream(stream) {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
    ];
    if (options.envs.is_production) {
        processors.push(cssnano())
    }
    return stream
        .pipe(postcss(processors))
}

gulp.task('css:sass', function () {

    let stream = gulp.src(APP_PATH.scss + '/**/[^_]*.scss')
        .pipe(preprocess({context: options.project.context}))
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
gulp.task('css:sass:check', function () {
    // gem install scss-lint
    return gulp.src(APP_PATH.scss || [APP_PATH.css + '**/[^_]*.scss', '!' + APP_PATH.css + 'base/_reset.scss'])
        .pipe(scsslint(
            {
                'config': '.scss-lint.yml'
            }
        ))
});

gulp.task('css', ['css:sass:check', 'css:sass']);

