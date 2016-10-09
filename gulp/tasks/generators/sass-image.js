'use strict';
import _ from 'lodash';
import gulp from 'gulp';
import sassImage from 'gulp-sass-image';

var merge = require('merge-stream');

var options = require('../../options');

const IMAGES_ENTRIES = options.project['sass-image'];

const SCSS_ROOT = options.project.path.app.scss;

gulp.task('gen:sass-image', function () {
    let streams = _.map(IMAGES_ENTRIES, (opt, name) => {
        return gulp.src(`${opt.root}/**/*.+(jpeg|jpg|png|gif|svg)`)
            .pipe(sassImage({
                targetFile: `_${name}.scss`,
                http_images_path: `${opt.http_images_path}`,
                includeData: opt.base64,
                prefix: `${opt.suffix}`
            }))
    });
    return merge(streams)
        .pipe(gulp.dest(SCSS_ROOT));
});
