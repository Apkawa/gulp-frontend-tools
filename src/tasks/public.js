'use strict'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import changed from 'gulp-changed'
import gulpif from 'gulp-if'
import uglify from 'gulp-uglify'
import size from 'gulp-size'
import merge from 'merge-stream'
import filter from 'gulp-filter'
import sourcemaps from 'gulp-sourcemaps'

import debug from 'gulp-debug'

import imagemin from 'gulp-imagemin'
import imageminJpegoptim from 'imagemin-jpegoptim'

const IMG_GLOB = '**/*.{png,jpg,jpeg,gif}'
const CSS_GLOB = '**/*.css'
const JS_GLOB = '**/*.js'

export default function (gulp, config) {
  //var cssStream = require('./styles/sass');
  const PUBLIC_FILES = config.project.path.app.public
  const DIST_PATH = config.project.path.dist
  const DIST_ROOT = config.project.dist_root

  const SOURCE_MAP_DIST = path.join(path.basename(DIST_PATH.source_maps))

  const isProduction = config.envs.is_production

  function imagesStream (stream, imageminOptions) {
    const imgFilter = filter(IMG_GLOB, {restore: true})
    imageminOptions = {
      plugins: [
        imageminJpegoptim({progressive: true, max: 85}),
        imagemin.gifsicle(),
        imagemin.optipng(),
        imagemin.svgo()
      ],
      verbose: true
    }
    return stream
      .pipe(imgFilter)
      .pipe(gulpif(isProduction, imagemin(imageminOptions.plugins, imageminOptions)))
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
    let streams = _.map(PUBLIC_FILES, (publicRoot) => {
      let filesGlob
      if (_.isString(publicRoot)) {
        filesGlob = [
          {
            base: publicRoot,
            glob: path.join(publicRoot, '/**/*'),
            dist: DIST_ROOT
          }
        ]
      }
      if (_.isPlainObject(publicRoot)) {
        let {root, files, imagemin} = publicRoot
        filesGlob = _.map(files,
          f => {
            const _file = path.resolve(publicRoot, f)
            const isDir = fs.lstatSync(_file).isDirectory()
            return {
              glob: path.resolve(_file, isDir ? '**/*' : ''),
              base: isDir ? _file : path.dirname(_file),
              dist: path.resolve(DIST_ROOT, root)
            }
          })
      }
      const subStreams = _.map(filesGlob, ({base, glob, dist}) => {
        let stream = gulp
          .src(glob, {base})
          .pipe(changed(dist))

        stream = imagesStream(stream, imagemin)
        stream = jsStream(stream)
        // TODO cssStream
        // stream = cssStream(stream);
        return stream
          .pipe(gulp.dest(dist))
      })

      return merge(subStreams)
    })
    return merge(streams)
  })
}
