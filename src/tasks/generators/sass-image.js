'use strict';
import _ from "lodash";
import sassImage from "gulp-sass-image";
import merge from "merge-stream";


export default function (gulp, config) {

    const IMAGES_ENTRIES = config.project['sass-image'];

    const SCSS_ROOT = config.project.path.app.scss;

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
}
