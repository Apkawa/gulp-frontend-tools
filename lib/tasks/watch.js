'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    function watch(glob, tasks) {
        var reload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        return _watch(glob, batch(function (events, done) {
            gulp.start(tasks, function () {
                if (reload) {
                    browserSync.reload();
                }
                done();
            });
        }));
    }

    var APP_PATH = config.project.path.app;
    /*
     * Default & Watch tasks
     */

    gulp.task('watch', ['default'], function () {
        watch(APP_PATH.css + '**/*[^_]', ['css'], true);
        watch(APP_PATH.template + '**/*[^_]', ['templates']);
        watch(APP_PATH.template_context + '**/*[^_]', ['templates']);
        watch(APP_PATH.public, ['public'], true);
    });

    gulp.task('watch:webpack', ['watch', 'webpack:watch']);
};

var _runSequence = require('run-sequence');

var _runSequence2 = _interopRequireDefault(_runSequence);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _watch = require('gulp-watch');
var batch = require('gulp-batch');
module.exports = exports['default'];