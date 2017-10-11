'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (gulp, config) {

  var SPRITE_ENTRIES = config.sprite;
  var SCSS_ROOT = config.project.path.app.scss;

  gulp.task('gen:sprite', function () {
    // Generate our spritesheet
    var streams = _lodash2.default.map(SPRITE_ENTRIES, function (_ref, name) {
      var imgRoot = _ref.imgRoot,
          imgPath = _ref.imgPath,
          suffix = _ref.suffix,
          root = _ref.root,
          stylePath = _ref.stylePath;

      imgPath = imgPath || _path2.default.normalize(imgRoot + '/' + name + '.png');
      stylePath = stylePath || SCSS_ROOT + '/_' + name + '.scss';
      suffix = suffix || name;

      var styleName = _path2.default.basename(stylePath);
      var imgName = _path2.default.basename(imgPath);

      var spriteData = gulp.src(root + '/**/*.png').pipe((0, _gulpSize2.default)({ showFiles: true, gzip: true })).pipe((0, _gulp2.default)({
        imgName: imgName,
        imgPath: imgRoot,
        cssName: styleName,
        cssVarMap: function cssVarMap(sprite) {
          sprite.name = suffix + '-' + sprite.name;
        }
      }));

      // Pipe image stream through image optimizer and onto disk
      var imgStream = spriteData.img.pipe((0, _vinylBuffer2.default)()).pipe((0, _gulpSize2.default)({ showFiles: true, gzip: true })).pipe(gulp.dest(_path2.default.dirname(imgPath)));

      // Pipe CSS stream through CSS optimizer and onto disk
      var cssStream = spriteData.css.pipe(gulp.dest(_path2.default.dirname(stylePath)));
      return (0, _mergeStream2.default)(imgStream, cssStream);
    });

    return _mergeStream2.default.apply(undefined, _toConsumableArray(streams));
  });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _vinylBuffer = require('vinyl-buffer');

var _vinylBuffer2 = _interopRequireDefault(_vinylBuffer);

var _mergeStream = require('merge-stream');

var _mergeStream2 = _interopRequireDefault(_mergeStream);

var _gulpSize = require('gulp-size');

var _gulpSize2 = _interopRequireDefault(_gulpSize);

var _gulp = require('gulp.spritesmith');

var _gulp2 = _interopRequireDefault(_gulp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = exports['default'];