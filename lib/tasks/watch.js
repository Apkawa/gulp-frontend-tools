'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    function watch(glob, tasks) {
        return _watch(glob, batch(function (events, done) {
            _runSequence2.default.use(gulp).apply(undefined, [].concat(_toConsumableArray(tasks), [done]));
        }));
    }

    var APP_PATH = config.project.path.app;
    /*
     * Default & Watch tasks
     */

    gulp.task('watch', ['default'], function () {
        watch(APP_PATH.css + '**/*[^_]', ['css', browserSync.reload]);
        watch(APP_PATH.template + '**/*[^_]', ['templates']);
        watch(APP_PATH.template_context + '**/*[^_]', ['templates']);
        watch(APP_PATH.public, ['public', browserSync.reload]);
    });

    gulp.task('watch:webpack', ['watch', 'webpack:watch']);
};

var _runSequence = require('run-sequence');

var _runSequence2 = _interopRequireDefault(_runSequence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _watch = require('gulp-watch');
var batch = require('gulp-batch');
module.exports = exports['default'];