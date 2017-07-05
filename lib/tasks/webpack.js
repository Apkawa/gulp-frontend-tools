'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {

    var webpack_options = config.webpack.getConfig(config);

    gulp.task('webpack:watch', function (callback) {
        webpack_options.watch = true;
        (0, _webpack2.default)(webpack_options, function (err, stats) {
            if (err) {
                throw new _gulpUtil2.default.PluginError("webpack", err);
            }
            _gulpUtil2.default.log("[webpack]", stats.toString({
                colors: true,
                reasons: true
            }));
            _gulpUtil2.default.log("[webpack]", _gulpUtil2.default.colors.green('Done...'));
        });
    });

    gulp.task('webpack', function (callback) {
        (0, _webpack2.default)(webpack_options, function (err, stats) {
            if (err) {
                throw new _gulpUtil2.default.PluginError("webpack", err);
            }
            _gulpUtil2.default.log("[webpack]", stats.toString({
                colors: true,
                reasons: true
            }));
            callback();
        });
    });
};

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _gulpUtil = require("gulp-util");

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports["default"];