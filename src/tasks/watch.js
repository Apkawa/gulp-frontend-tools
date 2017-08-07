'use strict'
import path from 'path'
import _ from  'lodash'
import _runSequence  from 'run-sequence'

export default function (gulp, config) {
  const runSequence = _runSequence.use(gulp)
  const cwd = config.project.app_root
  const browserSyncOptions = config.browserSync
  const browserSync = browserSyncOptions.browserSync

  function watch (glob, tasks, reload_glob) {
    if (reload_glob) {
      tasks.push(() => browserSync.reload(reload_glob))
    }
    const relativePath = path.relative(cwd, glob)
    return gulp.watch(relativePath, {cwd}, () => {
      runSequence(...tasks)
    })
  }

  const {project: {dist_root, path: {app: APP_PATH}}, watch: watchDirs} = config
  /*
   * Default & Watch tasks
   */
  let public_path = APP_PATH.public
  if (_.isString(public_path)) {
    public_path = [public_path]
  }

  gulp.task('watch', ['default'], function () {
    watch(APP_PATH.css + '**/*', ['css'], '**/*.css')
    watch(config.template.root + '**/*', ['templates',], '**/*.html')
    watch(config.template.context_root + '**/*', ['templates',], '**/*.html')
    _.each(
      public_path,
      p => {
        watch(p + '**/*', ['public'], `${dist_root}**/*`)
      },
    )
    _.each(watchDirs,
      ([glob, tasks, reload_glob]) => {
        watch(glob, tasks, reload_glob)
      })

  })

  gulp.task('watch:webpack', ['watch', 'webpack:watch'])
}
