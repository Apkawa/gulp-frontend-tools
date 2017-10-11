'use strict'
import _ from 'lodash'
import path from 'path'
import buffer from 'vinyl-buffer'
import merge from 'merge-stream'
import size from 'gulp-size'
import spritesmith from 'gulp.spritesmith'

export default function (gulp, config) {

  const SPRITE_ENTRIES = config.sprite
  const SCSS_ROOT = config.project.path.app.scss

  gulp.task('gen:sprite', function () {
    // Generate our spritesheet
    let streams = _.map(SPRITE_ENTRIES,
      ({imgRoot, imgPath, suffix, root, stylePath}, name) => {
        imgPath = imgPath || path.normalize(`${imgRoot}/${name}.png`)
        stylePath = stylePath || `${SCSS_ROOT}/_${name}.scss`
        suffix = suffix || name

        const styleName = path.basename(stylePath)
        const imgName = path.basename(imgPath)

        const spriteData = gulp.src(`${root}/**/*.png`)
          .pipe(size({showFiles: true, gzip: true}))
          .pipe(spritesmith({
            imgName,
            imgPath: imgRoot,
            cssName: styleName,
            cssVarMap: function (sprite) {
              sprite.name = `${suffix}-${sprite.name}`
            },
          }))

        // Pipe image stream through image optimizer and onto disk
        const imgStream = spriteData.img
          .pipe(buffer())
          .pipe(size({showFiles: true, gzip: true}))
          .pipe(gulp.dest(path.dirname(imgPath)))

        // Pipe CSS stream through CSS optimizer and onto disk
        const cssStream = spriteData.css
          .pipe(gulp.dest(path.dirname(stylePath)))
        return merge(imgStream, cssStream)
      })

    return merge(...streams)
  })
}
