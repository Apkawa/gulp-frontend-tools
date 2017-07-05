var gulp = require('gulp')
var initGulpTasks = require('..')

var config = {
  project: {
    webpack: {
      hot: false,
      bundle_analyzer: false,
      defines: {
        EXAMPLE_DEFINE: '\'{{ envs.example_define|default("no_defined") }}\'',
      },
    },
  },
  webpack: {
    options: {
      providePlugin: {
        $: 'cash-dom',
      },
    },
  },
}
initGulpTasks(gulp, config, __dirname)
