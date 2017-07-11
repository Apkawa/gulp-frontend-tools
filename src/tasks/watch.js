'use strict'
import _ from  'lodash'
var _watch = require('gulp-watch')
var batch = require('gulp-batch')
import runSequence from 'run-sequence'

export default function (gulp, config) {
  var browserSyncOptions = config.browserSync
  var browserSync = browserSyncOptions.browserSync

  function watch (glob, tasks, reload_glob) {
    if (reload_glob) {
      tasks.push(() => browserSync.reload(reload_glob))
    }
    return gulp.watch(glob, tasks)
  }

  const {project: {dist_root, path: {app: APP_PATH}}} = config
  /*
   * Default & Watch tasks
   */
  let public_path = APP_PATH.public
  if (_.isString(public_path)) {
    public_path = [public_path]
  }

  gulp.task('watch', ['default'], function () {
    watch(APP_PATH.css + '**/*[^_]', ['css'], '**/*.css')
    watch(APP_PATH.template + '**/*[^_]', ['templates',])
    watch(APP_PATH.template_context + '**/*[^_]', ['templates',])
    _.each(
      public_path,
      p => {
        console.log(p, dist_root)
        watch(p + '**/*', ['public'], `${dist_root}**/*`)
      },
    )

  })

  gulp.task('watch:webpack', ['watch', 'webpack:watch'])
}
