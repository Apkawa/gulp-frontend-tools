'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {

    var SPRITE_ENTRIES = config.project.sprite;
    var SCSS_ROOT = config.project.path.app.scss;

    gulp.task('gen:sprite', function () {
        // Generate our spritesheet
        var streams = _lodash2.default.map(SPRITE_ENTRIES, function (opt, name) {
            var spriteRoot = _lodash2.default.get(opt, 'spriteRoot', _path2.default.dirname(opt.root));

            var imgPath = _path2.default.normalize(opt.imgRoot + "/" + name + ".png");
            var cssName = "_" + name + ".scss";
            var suffix = _lodash2.default.get(opt, 'suffix', name + '-');
            var spriteData = gulp.src(opt.root + "/" + name + "/**/*.png").pipe((0, _gulp2.default)({
                imgName: _path2.default.basename(imgPath),
                imgPath: imgPath,
                cssName: cssName,
                cssVarMap: function cssVarMap(sprite) {
                    sprite.name = suffix + "-" + sprite.name;
                }
            }));

            // Pipe image stream through image optimizer and onto disk
            var imgStream = spriteData.img
            // DEV: We must buffer our stream into a Buffer for `imagemin`
            .pipe((0, _vinylBuffer2.default)()).pipe((0, _gulpSize2.default)({ showFiles: true, gzip: true })).pipe(gulp.dest(spriteRoot));

            // Pipe CSS stream through CSS optimizer and onto disk
            var cssStream = spriteData.css.pipe(gulp.dest(SCSS_ROOT));
            return (0, _mergeStream2.default)(imgStream, cssStream);
        });

        return _mergeStream2.default.apply(undefined, _toConsumableArray(streams));
    });
};

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _vinylBuffer = require("vinyl-buffer");

var _vinylBuffer2 = _interopRequireDefault(_vinylBuffer);

var _mergeStream = require("merge-stream");

var _mergeStream2 = _interopRequireDefault(_mergeStream);

var _gulpSize = require("gulp-size");

var _gulpSize2 = _interopRequireDefault(_gulpSize);

var _gulp = require("gulp.spritesmith");

var _gulp2 = _interopRequireDefault(_gulp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = exports["default"];