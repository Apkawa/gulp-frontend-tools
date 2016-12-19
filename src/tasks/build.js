'use strict';
import runSequence from "run-sequence";
import filter from "gulp-filter";
import gzip from "gulp-gzip";
import size from "gulp-size";

export default function (gulp, config) {

    const DIST_ROOT = config.project.dist_root;
    gulp.task('dist:gzip', () => {
        gulp.src(DIST_ROOT + '/**/*.+(css|js)')
            .pipe(gzip({threshold: '1kb'}))
            .pipe(filter('**/*.gz'))
            .pipe(size({showFiles: true}))
            .pipe(gulp.dest(DIST_ROOT))
    });

    gulp.task('build', () => {
        runSequence.use(gulp)('clean', 'default', 'dist:gzip')
    })
}





