'use strict';
export default function (gulp, config) {
    const {getBSConfig, browserSync} = config.browserSync

    gulp.task('serve', ['watch', 'templates'], function () {
        browserSync.init(getBSConfig(config));
    });

}

