'use strict';
var _watch = require('gulp-watch');
var batch = require('gulp-batch');
import runSequence from 'run-sequence';


export default function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    function watch(glob, tasks) {
        return _watch(glob, batch((events, done) => {
            runSequence.use(gulp)(
                ...[...tasks, done
                ]
            )
        }))

    }

    const {project: {path: {app: APP_PATH}}} = config;
    /*
     * Default & Watch tasks
     */
    gulp.task('watch', ['default'], function () {
        watch(APP_PATH.css + '**/*[^_]', ['css', browserSync.reload]);
        watch(APP_PATH.template + '**/*[^_]', ['templates',]);
        watch(APP_PATH.template_context + '**/*[^_]', ['templates',]);
        watch(APP_PATH.public, ['public', browserSync.reload]);
    });

    gulp.task('watch:webpack', ['watch', 'webpack:watch']);
}
