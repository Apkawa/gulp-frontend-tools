'use strict';
export default function (gulp, config) {
    const browserSyncOptions = config.browserSync;
    const browserSync = browserSyncOptions.browserSync;

    gulp.task('serve', ['watch', 'templates'], function () {
        browserSync.init(browserSyncOptions.get_options(config));
    });

}

