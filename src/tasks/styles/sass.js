'use strict';
import _ from 'lodash'
import path from "path";
import scsslint from "gulp-scss-lint";
import sass from "gulp-sass";
import sassGlob from "gulp-sass-glob";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "gulp-postcss";
import preprocess from "gulp-preprocess";
import sourcemaps from "gulp-sourcemaps";
import sassVariables from "gulp-sass-variables";

export default function (gulp, config) {
    const APP_PATH = config.project.path.app;
    const DIST_PATH = config.project.path.dist;
    const SOURCE_MAP_DIST = path.join('..', path.basename(DIST_PATH.source_maps));

    const sassOpts = config.project.sass;
    const scss_lint_opts = config.project.scss_lint;

    function cssStream(stream, config) {
        let processors = [
            autoprefixer({browsers: ['last 3 versions']}),
        ];
        if (config.envs.is_production) {
            processors.push(cssnano())
        }
        return stream
            .pipe(postcss(processors))
    }

    gulp.task('sass', function () {
        const context = config.project.context;
        const variables = _.fromPairs(_.map(context, (v, k) => ['$' + k, v]));

        let stream = gulp.src(APP_PATH.scss + '/**/*.scss')
            .pipe(preprocess({context: config.project.context}))
            .pipe(sassVariables(variables))
            .pipe(sourcemaps.init())
            .pipe(sassGlob(sassOpts))
            .pipe(sass(sassOpts).on('error', sass.logError));

        return cssStream(stream, config)
            .pipe(sourcemaps.write(SOURCE_MAP_DIST))
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
