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
            var spriteRoot = _lodash2.default.get(opt, 'spriteRoot', path.dirname(opt.root));

            var imgPath = path.normalize(opt.imgRoot + '/' + name + '.png');
            var cssName = '_' + name + '.scss';
            var suffix = _lodash2.default.get(opt, 'suffix', name + '-');
            var spriteData = gulp.src(opt.root + '/' + name + '/**/*.png').pipe(spritesmith({
                imgName: path.basename(imgPath),
                imgPath: imgPath,
                cssName: cssName,
                cssVarMap: function cssVarMap(sprite) {
                    sprite.name = suffix + '-' + sprite.name;
                }
            }));

            // Pipe image stream through image optimizer and onto disk
            var imgStream = spriteData.img
            // DEV: We must buffer our stream into a Buffer for `imagemin`
            .pipe(buffer()).pipe(size({ showFiles: true, gzip: true })).pipe(gulp.dest(spriteRoot));

            // Pipe CSS stream through CSS optimizer and onto disk
            var cssStream = spriteData.css.pipe(gulp.dest(SCSS_ROOT));
            return merge(imgStream, cssStream);
        });

        return merge.apply(undefined, _toConsumableArray(streams));
    });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var path = require('path');
var buffer = require('vinyl-buffer');
var merge = require('merge-stream');

var spritesmith = require('gulp.spritesmith');

var size = require('gulp-size');

module.exports = exports['default'];