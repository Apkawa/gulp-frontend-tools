'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var APP_PATH = config.project.path.app;
    var DIST_PATH = config.project.path.dist;
    var SOURCE_MAP_DIST = _path2.default.join('..', _path2.default.basename(DIST_PATH.source_maps));
    var sassOpts = config.project.sass;
    var scss_lint_opts = config.project.scss_lint;

    function cssStream(stream, config) {
        var processors = [(0, _autoprefixer2.default)({ browsers: ['last 3 versions'] })];
        if (config.envs.is_production) {
            processors.push((0, _cssnano2.default)());
        }
        return stream.pipe((0, _gulpPostcss2.default)(processors));
    }

    gulp.task('sass', function () {
        var stream = gulp.src(APP_PATH.scss + '/**/*.scss').pipe((0, _gulpPreprocess2.default)({ context: config.project.context })).pipe(_gulpSourcemaps2.default.init()).pipe((0, _gulpSassGlob2.default)(sassOpts)).pipe((0, _gulpSass2.default)(sassOpts).on('error', _gulpSass2.default.logError));

        return cssStream(stream, config).pipe(_gulpSourcemaps2.default.write(SOURCE_MAP_DIST)).pipe(gulp.dest(DIST_PATH.css));
    });

    /*
     * Check CSS
     */
    gulp.task('sass:lint', function () {
        // gem install scss-lint
        return gulp.src(APP_PATH.scss || [APP_PATH.css + '**/[^_]*.scss', '!' + APP_PATH.css + 'base/_reset.scss']).pipe((0, _gulpScssLint2.default)(scss_lint_opts));
    });

    gulp.task('css', ['sass']);
};

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _gulpScssLint = require("gulp-scss-lint");

var _gulpScssLint2 = _interopRequireDefault(_gulpScssLint);

var _gulpSass = require("gulp-sass");

var _gulpSass2 = _interopRequireDefault(_gulpSass);

var _gulpSassGlob = require("gulp-sass-glob");

var _gulpSassGlob2 = _interopRequireDefault(_gulpSassGlob);

var _autoprefixer = require("autoprefixer");

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _cssnano = require("cssnano");

var _cssnano2 = _interopRequireDefault(_cssnano);

var _gulpPostcss = require("gulp-postcss");

var _gulpPostcss2 = _interopRequireDefault(_gulpPostcss);

var _gulpPreprocess = require("gulp-preprocess");

var _gulpPreprocess2 = _interopRequireDefault(_gulpPreprocess);

var _gulpSourcemaps = require("gulp-sourcemaps");

var _gulpSourcemaps2 = _interopRequireDefault(_gulpSourcemaps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];