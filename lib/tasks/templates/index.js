"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    var DIST_ROOT = config.project.dist_root;
    var TEMPLATE_NAME = _path2.default.join(__dirname, '../../../templates', 'index.j2');

    // TODO maybe browsersync plugin?
    gulp.task('templates:index', function () {
        var filenames = _lodash2.default.keys((0, _collect_filenames2.default)(DIST_ROOT, '/**/*.html'));
        return gulp.src(TEMPLATE_NAME).pipe((0, _gulpData2.default)(function () {
            return { filenames: filenames };
        })).pipe((0, _gulpNunjucksRender2.default)()).pipe((0, _gulpRename2.default)('index.html')).pipe(gulp.dest(DIST_ROOT)).pipe(browserSync.stream());
    });

    gulp.task('templates', ['templates:jinja2']);
};

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _gulpRename = require("gulp-rename");

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _gulpNunjucksRender = require("gulp-nunjucks-render");

var _gulpNunjucksRender2 = _interopRequireDefault(_gulpNunjucksRender);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _gulpData = require("gulp-data");

var _gulpData2 = _interopRequireDefault(_gulpData);

var _collect_filenames = require("../../libs/collect_filenames");

var _collect_filenames2 = _interopRequireDefault(_collect_filenames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];