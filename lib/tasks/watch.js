'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
      APP_PATH = _config$project.path.app,
      watchDirs = config.watch;
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
    _lodash2.default.each(watchDirs, function (_ref) {
      var _ref2 = _slicedToArray(_ref, 3),
          glob = _ref2[0],
          tasks = _ref2[1],
          reload_glob = _ref2[2];

      watch(glob, tasks, reload_glob);
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