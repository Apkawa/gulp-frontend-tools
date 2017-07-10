const gulp = require('gulp')
const Tools = require('..')

const loadContext = require('../lib/libs/loadData').loadContext

const config = {
  webpack: {
    hot: true,
    extract_css: true,
    bundle_analyzer: false,
    providePlugin: {
      $: 'cash-dom',
    },
  },
  project: {
    sass: {
      includePaths: [
        'test',
      ],
    },
  },
  template: {
    globals: {
      get_example: () => loadContext('example'),
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
