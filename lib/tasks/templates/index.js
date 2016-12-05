"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    var DIST_ROOT = config.project.dist_root;
    var TEMPLATE_NAME = path.join(__dirname, '../../../templates', 'index.j2');

    // TODO maybe browsersync plugin?
    gulp.task('templates:index', function () {
        var filenames = _.keys((0, _collect_filenames2.default)(DIST_ROOT, '/**/*.html'));
        return gulp.src(TEMPLATE_NAME).pipe(data(function () {
            return { filenames: filenames };
        })).pipe(nunjucksRender()).pipe(rename('index.html')).pipe(gulp.dest(DIST_ROOT)).pipe(browserSync.stream());
    });

    gulp.task('templates', ['templates:jinja2']);
};

var _collect_filenames = require("../../libs/collect_filenames");

var _collect_filenames2 = _interopRequireDefault(_collect_filenames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var rename = require("gulp-rename");
var nunjucksRender = require('gulp-nunjucks-render');

var path = require('path');
var data = require('gulp-data');

module.exports = exports["default"];