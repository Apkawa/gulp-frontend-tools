"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _gulpUtil = require("gulp-util");

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getEnvs() {
    var envs = {
        'type': _gulpUtil2.default.env.type,
        'project': _gulpUtil2.default.env.project || "example",
        'lib_root': _path2.default.dirname(_path2.default.dirname(__dirname))
    };
    envs.is_production = envs.type == 'production';
    envs.debug = !envs.is_production;

    return envs;
}

module.exports = getEnvs();