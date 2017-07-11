'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (gulp, config) {
  var browserSyncOptions = config.browserSync;
  var browserSync = browserSyncOptions.browserSync;

  function watch(glob, tasks, reload_glob) {
    if (reload_glob) {
      tasks.push(function () {
        return browserSync.reload(reload_glob);
      });
    }
    return gulp.watch(glob, tasks);
  }

  var _config$project = config.project,
      dist_root = _config$project.dist_root,
      APP_PATH = _config$project.path.app;
  /*
   * Default & Watch tasks
   */

  var public_path = APP_PATH.public;
  if (_lodash2.default.isString(public_path)) {
    public_path = [public_path];
  }

  gulp.task('watch', ['default'], function () {
    watch(APP_PATH.css + '**/*[^_]', ['css'], '**/*.css');
    watch(APP_PATH.template + '**/*[^_]', ['templates']);
    watch(APP_PATH.template_context + '**/*[^_]', ['templates']);
    _lodash2.default.each(public_path, function (p) {
      watch(p + '**/*', ['public'], dist_root + '**/*');
    });
  });

  gulp.task('watch:webpack', ['watch', 'webpack:watch']);
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];