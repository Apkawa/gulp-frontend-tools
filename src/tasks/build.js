'use strict';
import runSequence from 'run-sequence';


export default function (gulp, config) {
    gulp.task('build', () => {
        runSequence.use(gulp)('clean', 'default')
    })
}





