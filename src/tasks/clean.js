'use strict';
var clean = require('gulp-clean');

export default function (gulp, config) {
    const {project: {dist_root: DIST_ROOT}} = config;

    gulp.task('clean', function () {
        return gulp.src(DIST_ROOT, {read: false})
            .pipe(clean({force: true}))

    })
}
