'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var browserSyncOptions = config.browserSync;
    var browserSync = browserSyncOptions.browserSync;

    var template_options = config.template;

    var TEMPLATE_ROOT = config.project.template.root;
    var CONTEXT_ROOT = config.project.template.context;
    var APP_ROOT = config.project.app_root;
    var DIST_ROOT = config.project.dist_root;

    var getJsonData = function getJsonData(file) {
        var parsed = path.parse(path.normalize(file.path));
        var dirname = _.slice(parsed.dir, path.normalize(TEMPLATE_ROOT).length).join('');
        dirname = dirname.replace('_jinja', '');
        var name = path.join(dirname, parsed.name);

        return loadData(name, CONTEXT_ROOT);
    };

    function errorHandler(err) {
        if (err) {
            // TODO bs-fullscreen
        }
        gutil.log(gutil.colors.cyan('Plumber') + gutil.colors.red(' found unhandled error:\n'), err.toString());
    }

    gulp.task('templates:jinja2', function () {
        return gulp.src(TEMPLATE_ROOT + '/**/*.{jinja2,html,j2}', { base: APP_ROOT }).pipe(ignore.exclude(_ignore_template2.default)).pipe(debug({ title: "template" })).pipe(data(getJsonData)).pipe(plumber(errorHandler)).pipe(nunjucksRender(template_options)).pipe(plumber.stop()).pipe(gulp.dest(DIST_ROOT)).pipe(browserSync.stream());
    });
};

var _ignore_template = require('../../libs/ignore_template');

var _ignore_template2 = _interopRequireDefault(_ignore_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gutil = require('gulp-util');
var _ = require('lodash');
var rename = require("gulp-rename");
var nunjucksRender = require('gulp-nunjucks-render');

var path = require('path');
var data = require('gulp-data');
var plumber = require('gulp-plumber');
var ignore = require('gulp-ignore');
var debug = require('gulp-debug');

var loadData = require('../../libs/load_data');

module.exports = exports['default'];