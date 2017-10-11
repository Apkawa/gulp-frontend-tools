'use strict'
import _ from 'lodash'
import path from 'path'
import sassImage from 'gulp-sass-image'
import merge from 'merge-stream'
import size from 'gulp-size'

export default function (gulp, config) {

  const IMAGES_ENTRIES = config['sass-image']

  const SCSS_ROOT = config.project.path.app.scss

  gulp.task('gen:sass-image', function () {
    let streams = _.map(
      IMAGES_ENTRIES,
      ({root, http_images_path, suffix, base64: includeBase64, stylePath}, name) => {
        stylePath = stylePath || `${SCSS_ROOT}/_${name}.scss`
        const targetFile = path.basename(stylePath)

        return gulp.src(`${root}/**/*.+(jpeg|jpg|png|gif|svg)`)
          .pipe(size({showFiles: true, gzip: true}))
          .pipe(sassImage({
            targetFile,
            http_images_path,
            includeData: includeBase64,
            prefix: suffix,
          }))
          .pipe(size({showFiles: true, gzip: true}))
          .pipe(gulp.dest(path.dirname(stylePath)))
      })
    return merge(streams)
  })
}
