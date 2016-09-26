'use strict';
var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');
var sass = require('gulp-sass');
var sassGlob = require('gulp-sass-glob');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var cleanCSS = require('gulp-clean-css');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');


var options = require('../../options');


var APP_PATH = options.project.path.app;
var DIST_PATH = options.project.path.dist;


/*
 * Sass
 *  - Generate CSS
 *  - Add autoprefix
 *  - Add sourcemaps
 */
gulp.task('css:sass', function () {

    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
    ];
    return gulp.src(APP_PATH.scss || APP_PATH.css + '/**/[^_]*.scss')
        .pipe(gulpif(!options.envs.is_production, sourcemaps.init()))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(cleanCSS())
        .pipe(gulpif(!options.envs.is_production, sourcemaps.write()))
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

