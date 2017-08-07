'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (gulp, config) {
  var browserSyncOptions = config.browserSync;
  var browserSync = browserSyncOptions.browserSync;

  var template_options = config.template;

  var TEMPLATE_ROOT = config.template.root;
  var CONTEXT_ROOT = config.template.context_root;
  var TEMPLATE_DIST_ROOT = _lodash2.default.get(config, 'template.dist');

  var getJsonData = function getJsonData(file) {
    var parsed = _path2.default.parse(_path2.default.normalize(file.path));
    var dirname = _lodash2.default.slice(parsed.dir, _path2.default.normalize(TEMPLATE_ROOT).length).join('');
    dirname = dirname.replace('_jinja', '');
    var name = _path2.default.join(dirname, parsed.name);
    return (0, _loadData2.default)(name, CONTEXT_ROOT);
  };

  function errorHandler(err) {
    if (err) {
      // TODO bs-fullscreen
    }
    _gulpUtil2.default.log(_gulpUtil2.default.colors.cyan('Plumber') + _gulpUtil2.default.colors.red(' found unhandled error:\n'), err.toString());
    // TODO write error to dest template
  }

  var env = template_options.createEnv(template_options, config);
  gulp.task('templates:jinja2', function () {
    return gulp.src(TEMPLATE_ROOT + '/**/*.{jinja2,html,j2}', { base: TEMPLATE_ROOT }).pipe(_gulpIgnore2.default.exclude(_ignore_template2.default)).pipe((0, _gulpDebug2.default)({ title: 'template' })).pipe((0, _gulpData2.default)(getJsonData)).pipe((0, _gulpPlumber2.default)(errorHandler)).pipe(_gulpNunjucks2.default.compile({}, { env: env })).pipe((0, _gulpRename2.default)({ extname: '.html' })).pipe(_gulpPlumber2.default.stop()).pipe(gulp.dest(TEMPLATE_DIST_ROOT)).pipe(browserSync.stream());
  });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _gulpDebug = require('gulp-debug');

var _gulpDebug2 = _interopRequireDefault(_gulpDebug);

var _gulpIgnore = require('gulp-ignore');

var _gulpIgnore2 = _interopRequireDefault(_gulpIgnore);

var _gulpPlumber = require('gulp-plumber');

var _gulpPlumber2 = _interopRequireDefault(_gulpPlumber);

var _gulpData = require('gulp-data');

var _gulpData2 = _interopRequireDefault(_gulpData);

var _gulpNunjucks = require('gulp-nunjucks');

var _gulpNunjucks2 = _interopRequireDefault(_gulpNunjucks);

var _gulpRename = require('gulp-rename');

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _loadData = require('../../libs/loadData');

var _loadData2 = _interopRequireDefault(_loadData);

var _ignore_template = require('../../libs/ignore_template');

var _ignore_template2 = _interopRequireDefault(_ignore_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];