'use strict'
import webpack from 'webpack'
import gutil from 'gulp-util'

export default function (gulp, config) {

  const webpack_options = config.webpack.getConfig(config)

  gulp.task('webpack:watch', function (callback) {
    webpack_options.watch = true
    webpack(webpack_options,
      function (err, stats) {
        if (err) {
          throw new gutil.PluginError('webpack', err)
        }
        gutil.log('[webpack]', stats.toString({
          colors: true,
          reasons: true
        }))
        gutil.log('[webpack]', gutil.colors.green('Done...'))
      })
  })

  gulp.task('webpack', function (callback) {
    gutil.log('[webpack]', 'init')
    webpack(webpack_options,
      function (err, stats) {
        if (err) {
          console.error(err.stack)
          throw new gutil.PluginError('webpack', err)
        }
        // if (stats.hasErrors()) {
        //   const statDetails = stats.toJson({errorDetails: true})
        //   // print out parse errors
        //   statDetails.errors.forEach((e) => gutil.log('[webpack]',e, e.stack), console.error(e))
        //   throw new gutil.PluginError('webpack', 'Parse/ build error(s)')
        // }
        gutil.log('[webpack]', stats.toString({
          colors: true,
          reasons: true,
          modules: true,
          errors: true,
          errorDetails: true
        }))

        gutil.log('[webpack]', 'end')
        callback()
      })
  })

}
