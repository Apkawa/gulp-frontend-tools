'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {

    var DIST_ROOT = config.project.dist_root;
    gulp.task('dist:gzip', function () {
        gulp.src(DIST_ROOT + '/**/*.+(css|js)').pipe((0, _gulpGzip2.default)({ threshold: '1kb' })).pipe((0, _gulpFilter2.default)('**/*.gz')).pipe((0, _gulpSize2.default)({ showFiles: true })).pipe(gulp.dest(DIST_ROOT));
    });

    gulp.task('build', function () {
        _runSequence2.default.use(gulp)('clean', 'default', 'dist:gzip');
    });
};

var _runSequence = require("run-sequence");

var _runSequence2 = _interopRequireDefault(_runSequence);

var _gulpFilter = require("gulp-filter");

var _gulpFilter2 = _interopRequireDefault(_gulpFilter);

var _gulpGzip = require("gulp-gzip");

var _gulpGzip2 = _interopRequireDefault(_gulpGzip);

var _gulpSize = require("gulp-size");

var _gulpSize2 = _interopRequireDefault(_gulpSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];