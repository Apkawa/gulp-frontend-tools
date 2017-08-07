'use strict'
import _ from 'lodash'
import path from 'path'

import gutil from 'gulp-util'

import debug from 'gulp-debug'
import ignore from 'gulp-ignore'
import plumber from 'gulp-plumber'
import data from 'gulp-data'
import gulpNunjucks from 'gulp-nunjucks'
import rename from 'gulp-rename'

import loadData from '../../libs/loadData'
import ignoreTemplate from '../../libs/ignore_template'

export default function (gulp, config) {
  const browserSyncOptions = config.browserSync
  const browserSync = browserSyncOptions.browserSync

  const template_options = config.template

  const TEMPLATE_ROOT = config.template.root
  const CONTEXT_ROOT = config.template.context_root
  const TEMPLATE_DIST_ROOT = _.get(config, 'template.dist')

  const getJsonData = function (file) {
    const parsed = path.parse(path.normalize(file.path))
    let dirname = _.slice(parsed.dir, path.normalize(TEMPLATE_ROOT).length).join('')
    dirname = dirname.replace('_jinja', '')
    const name = path.join(dirname, parsed.name)
    return loadData(name, CONTEXT_ROOT)
  }

  function errorHandler (err) {
    if (err) {
      // TODO bs-fullscreen
    }
    gutil.log(
      gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'),
      err.toString()
    )
    // TODO write error to dest template

  }

  const env = template_options.createEnv(template_options, config)
  gulp.task('templates:jinja2', function () {
    return gulp.src(TEMPLATE_ROOT + '/**/*.{jinja2,html,j2}', {base: TEMPLATE_ROOT})
               .pipe(ignore.exclude(ignoreTemplate))
               .pipe(debug({title: 'template'}))
               .pipe(data(getJsonData))
               .pipe(plumber(errorHandler))
               .pipe(gulpNunjucks.compile({}, {env: env}))
               .pipe(rename({extname: '.html'}))
               .pipe(plumber.stop())
               .pipe(gulp.dest(TEMPLATE_DIST_ROOT))
               .pipe(browserSync.stream())
  })
}
