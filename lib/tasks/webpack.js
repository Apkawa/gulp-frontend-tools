'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var webpack_options = config.webpack;
    webpack_options.entry = (0, _webpack_entry2.default)(config);

    gulp.task('webpack:watch', function (callback) {
        webpack_options.watch = true;
        webpack(webpack_options, function (err, stats) {
            if (err) {
                throw new gutil.PluginError("webpack", err);
            }
            gutil.log("[webpack]", stats.toString({
                colors: true,
                reasons: true
            }));
            gutil.log("[webpack]", gutil.colors.green('Done...'));
        });
    });

    gulp.task('webpack', function (callback) {
        webpack(webpack_options, function (err, stats) {
            if (err) {
                throw new gutil.PluginError("webpack", err);
            }
            gutil.log("[webpack]", stats.toString({
                colors: true,
                reasons: true
            }));
            callback();
        });
    });
};

var _webpack_entry = require('../libs/webpack_entry');

var _webpack_entry2 = _interopRequireDefault(_webpack_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var gutil = require('gulp-util');
var path = require('path');
var webpack = require("webpack");
module.exports = exports['default'];