'use strict';
export default function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    const {project: {path: {app: APP_PATH}}} = config;
    /*
     * Default & Watch tasks
     */
    gulp.task('watch', ['default'], function () {
        gulp.watch(APP_PATH.css + '**/*', ['css', browserSync.reload]);
        gulp.watch(APP_PATH.template + '**/*', ['templates',]);
        gulp.watch(APP_PATH.template_context + '**/*', ['templates',]);
        gulp.watch(APP_PATH.public, ['public', browserSync.reload]);
        //gulp.watch(APP_PATH.js + '**/*', []);
    });

    gulp.task('watch:webpack', ['watch', 'webpack:watch']);
}
