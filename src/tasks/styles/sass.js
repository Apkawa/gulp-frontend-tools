'use strict';
import path from "path";
import scsslint from "gulp-scss-lint";
import sass from "gulp-sass";
import sassGlob from "gulp-sass-glob";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcss from "gulp-postcss";
import preprocess from "gulp-preprocess";
import sourcemaps from "gulp-sourcemaps";


export default function (gulp, config) {
    const APP_PATH = config.project.path.app;
    const DIST_PATH = config.project.path.dist;
    const SOURCE_MAP_DIST = path.join('..', path.basename(DIST_PATH.source_maps));
    const sassOpts = config.project.sass;
    const scss_lint_opts = config.project.scss_lint;

    function cssStream(stream, config) {
        let processors = [
            autoprefixer({browsers: ['last 1 version']}),
        ];
        if (config.envs.is_production) {
            processors.push(cssnano())
        }
        return stream
            .pipe(postcss(processors))
    }

    gulp.task('sass', function () {
        let stream = gulp.src(APP_PATH.scss + '/**/*.scss')
            .pipe(preprocess({context: config.project.context}))
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
