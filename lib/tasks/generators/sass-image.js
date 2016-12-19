'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {

    var IMAGES_ENTRIES = config.project['sass-image'];

    var SCSS_ROOT = config.project.path.app.scss;

    gulp.task('gen:sass-image', function () {
        var streams = _lodash2.default.map(IMAGES_ENTRIES, function (opt, name) {
            return gulp.src(opt.root + "/**/*.+(jpeg|jpg|png|gif|svg)").pipe((0, _gulpSassImage2.default)({
                targetFile: "_" + name + ".scss",
                http_images_path: "" + opt.http_images_path,
                includeData: opt.base64,
                prefix: "" + opt.suffix
            }));
        });
        return (0, _mergeStream2.default)(streams).pipe(gulp.dest(SCSS_ROOT));
    });
};

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _gulpSassImage = require("gulp-sass-image");

var _gulpSassImage2 = _interopRequireDefault(_gulpSassImage);

var _mergeStream = require("merge-stream");

var _mergeStream2 = _interopRequireDefault(_mergeStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];