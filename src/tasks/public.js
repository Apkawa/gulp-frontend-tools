'use strict'
import path from 'path'
import _ from 'lodash'
import changed from 'gulp-changed'
import gulpif from 'gulp-if'
import imagemin from 'gulp-imagemin'
import uglify from 'gulp-uglify'
import size from 'gulp-size'
import merge from 'merge-stream'
import filter from 'gulp-filter'
import sourcemaps from 'gulp-sourcemaps'

import debug from 'gulp-debug'

const IMG_GLOB = '**/*.{png,jp?g,gif}'
const CSS_GLOB = '**/*.css'
const JS_GLOB = '**/*.js'


export default function (gulp, config) {
  //var cssStream = require('./styles/sass');
  const PUBLIC_FILES = config.project.path.app.public
  const DIST_PATH = config.project.path.dist
  const DIST_ROOT = config.project.dist_root

  const SOURCE_MAP_DIST = path.join(path.basename(DIST_PATH.source_maps))

  const isProduction = config.envs.is_production

  function imagesStream (stream) {
    const imgFilter = filter(IMG_GLOB, {restore: true})
    return stream
      .pipe(imgFilter)
      .pipe(gulpif(isProduction, imagemin({verbose: true})))
      .pipe(size({showFiles: true, gzip: true}))
      .pipe(imgFilter.restore)
  }

  function jsStream (stream) {
    const jsFilter = filter([JS_GLOB, '!**/*.min.js'], {restore: true})
    return stream
      .pipe(jsFilter)
      .pipe(sourcemaps.init())
      .pipe(gulpif(isProduction, uglify()))
      .pipe(sourcemaps.write(SOURCE_MAP_DIST))
      .pipe(size({showFiles: true, gzip: true}))
      .pipe(jsFilter.restore)

  }

  function cssStream (stream) {
    const cssFilter = filter([CSS_GLOB, '!**/*.min.css'], {restore: true})
    return stream
      .pipe(cssFilter)
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write(SOURCE_MAP_DIST))
      .pipe(size({showFiles: true, gzip: true}))
      .pipe(cssFilter.restore)

  }

  gulp.task('public', function () {
    let streams = _.map(PUBLIC_FILES, (public_root) => {
      const files_glob = path.join(public_root, '/**/*')
      let stream = gulp
        .src(files_glob, {base: public_root})
        .pipe(changed(DIST_ROOT))

      stream = imagesStream(stream)
      stream = jsStream(stream)
      // TODO cssStream
      // stream = cssStream(stream);

      return stream
        .pipe(gulp.dest(DIST_ROOT))
    })
    return merge(streams)
  })
}
