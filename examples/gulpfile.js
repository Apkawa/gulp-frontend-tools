const gulp = require('gulp')
const Tools = require('..')

const config = {
  webpack: {
    hot: true,
    extract_css: true,
    bundle_analyzer: false,
    providePlugin: {
      $: 'cash-dom',
    },
  },
}

Tools(gulp, config)
  .task('example', (gulp, config) => {
    gulp.task('example', () => {
      console.log(config.example)
    })
  })
  .configHook((config) => {
    config.example = 'EXAMPLE nya!'
    return config
  })
  .run()
