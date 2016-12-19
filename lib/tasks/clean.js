'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var DIST_ROOT = config.project.dist_root;


    gulp.task('clean', function () {
        return gulp.src(DIST_ROOT, { read: false }).pipe((0, _gulpClean2.default)({ force: true }));
    });
};

var _gulpClean = require('gulp-clean');

var _gulpClean2 = _interopRequireDefault(_gulpClean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];