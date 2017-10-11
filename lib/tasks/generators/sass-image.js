'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (gulp, config) {

  var IMAGES_ENTRIES = config['sass-image'];

  var SCSS_ROOT = config.project.path.app.scss;

  gulp.task('gen:sass-image', function () {
    var streams = _lodash2.default.map(IMAGES_ENTRIES, function (_ref, name) {
      var root = _ref.root,
          http_images_path = _ref.http_images_path,
          suffix = _ref.suffix,
          includeBase64 = _ref.base64,
          stylePath = _ref.stylePath;

      stylePath = stylePath || SCSS_ROOT + '/_' + name + '.scss';
      var targetFile = _path2.default.basename(stylePath);

      return gulp.src(root + '/**/*.+(jpeg|jpg|png|gif|svg)').pipe((0, _gulpSize2.default)({ showFiles: true, gzip: true })).pipe((0, _gulpSassImage2.default)({
        targetFile: targetFile,
        http_images_path: http_images_path,
        includeData: includeBase64,
        prefix: suffix
      })).pipe((0, _gulpSize2.default)({ showFiles: true, gzip: true })).pipe(gulp.dest(_path2.default.dirname(stylePath)));
    });
    return (0, _mergeStream2.default)(streams);
  });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpSassImage = require('gulp-sass-image');

var _gulpSassImage2 = _interopRequireDefault(_gulpSassImage);

var _mergeStream = require('merge-stream');

var _mergeStream2 = _interopRequireDefault(_mergeStream);

var _gulpSize = require('gulp-size');

var _gulpSize2 = _interopRequireDefault(_gulpSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];