'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    //var cssStream = require('./styles/sass');
    var APP_PATH = config.project.path.app;
    var DIST_PATH = config.project.path.dist;
    var DIST_ROOT = config.project.dist_root;

    var SOURCE_MAP_DIST = _path2.default.join(_path2.default.basename(DIST_PATH.source_maps));

    var isProduction = config.envs.is_production;

    function imagesStream(stream) {
        return stream.pipe(imgFilter).pipe((0, _gulpIf2.default)(isProduction, (0, _gulpImagemin2.default)({ verbose: true }))).pipe((0, _gulpSize2.default)({ showFiles: true, gzip: true })).pipe(imgFilter.restore);
    }

    function jsStream(stream) {
        return stream.pipe(jsFilter).pipe(_gulpSourcemaps2.default.init()).pipe((0, _gulpIf2.default)(isProduction, (0, _gulpUglify2.default)())).pipe(_gulpSourcemaps2.default.write(SOURCE_MAP_DIST)).pipe((0, _gulpSize2.default)({ showFiles: true, gzip: true })).pipe(jsFilter.restore);
    }

    function cssStream(stream) {
        return stream.pipe(cssFilter).pipe(_gulpSourcemaps2.default.init()).pipe(_gulpSourcemaps2.default.write(SOURCE_MAP_DIST)).pipe((0, _gulpSize2.default)({ showFiles: true, gzip: true })).pipe(cssFilter.restore);
    }

    gulp.task('public', function () {
        var streams = _lodash2.default.map(APP_PATH.public, function (public_root) {
            var files_glob = _path2.default.join(public_root, '/**/*');
            var stream = gulp.src(files_glob, { base: public_root }).pipe((0, _gulpChanged2.default)(DIST_ROOT));

            stream = imagesStream(stream);
            stream = jsStream(stream);
            // TODO cssStream
            // stream = cssStream(stream);

            return stream.pipe(gulp.dest(DIST_ROOT));
        });
        return (0, _mergeStream2.default)(streams);
    });
};

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _gulpChanged = require("gulp-changed");

var _gulpChanged2 = _interopRequireDefault(_gulpChanged);

var _gulpIf = require("gulp-if");

var _gulpIf2 = _interopRequireDefault(_gulpIf);

var _gulpImagemin = require("gulp-imagemin");

var _gulpImagemin2 = _interopRequireDefault(_gulpImagemin);

var _gulpUglify = require("gulp-uglify");

var _gulpUglify2 = _interopRequireDefault(_gulpUglify);

var _gulpSize = require("gulp-size");

var _gulpSize2 = _interopRequireDefault(_gulpSize);

var _mergeStream = require("merge-stream");

var _mergeStream2 = _interopRequireDefault(_mergeStream);

var _gulpFilter = require("gulp-filter");

var _gulpFilter2 = _interopRequireDefault(_gulpFilter);

var _gulpSourcemaps = require("gulp-sourcemaps");

var _gulpSourcemaps2 = _interopRequireDefault(_gulpSourcemaps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IMG_GLOB = '**/*.+(png|gif|jpeg|jpg|svg)';
var CSS_GLOB = '**/*.css';
var JS_GLOB = '**/*.js';

var imgFilter = (0, _gulpFilter2.default)(IMG_GLOB, { restore: true });
var cssFilter = (0, _gulpFilter2.default)([CSS_GLOB, '!**/*.min.css'], { restore: true });
var jsFilter = (0, _gulpFilter2.default)([JS_GLOB, '!**/*.min.js'], { restore: true });

module.exports = exports["default"];