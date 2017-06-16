'use strict';
import {pretty} from "js-object-pretty-print";

export default function (gulp, config) {
    gulp.task('default', ['public', 'css', 'webpack'])
    gulp.task('print-config', function () {
        console.log(pretty(config))
    })
}





