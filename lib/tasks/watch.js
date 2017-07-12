'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (gulp, config) {
  var runSequence = _runSequence3.default.use(gulp);
  var cwd = config.project.app_root;
  var browserSyncOptions = config.browserSync;
  var browserSync = browserSyncOptions.browserSync;

  function watch(glob, tasks, reload_glob) {
    if (reload_glob) {
      tasks.push(function () {
        return browserSync.reload(reload_glob);
      });
    }
    var relativePath = _path2.default.relative(cwd, glob);
    return gulp.watch(relativePath, { cwd: cwd }, function () {
      runSequence.apply(undefined, _toConsumableArray(tasks));
    });
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
    watch(APP_PATH.css + '**/*', ['css'], '**/*.css');
    watch(config.template.root + '**/*', ['templates']);
    watch(config.template.context_root + '**/*', ['templates']);
    _lodash2.default.each(public_path, function (p) {
      watch(p + '**/*', ['public'], dist_root + '**/*');
    });
  });

  gulp.task('watch:webpack', ['watch', 'webpack:watch']);
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _runSequence2 = require('run-sequence');

var _runSequence3 = _interopRequireDefault(_runSequence2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = exports['default'];