"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = initTasks;

var _requireDir = require("require-dir");

var _requireDir2 = _interopRequireDefault(_requireDir);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function evalTasks(wrap_func, gulp, compiled_config) {
    if (_lodash2.default.isFunction(wrap_func)) {
        wrap_func(gulp, compiled_config);
    } else {
        _lodash2.default.each(wrap_func, function (f) {
            evalTasks(f, gulp, compiled_config);
        });
    }
}

function initTasks(gulp, config, root) {
    var tasks = (0, _requireDir2.default)('./tasks', { recurse: true });
    config = _lodash2.default.merge({}, config, { envs: { root: root } });
    var compiled_config = (0, _config2.default)(config);
    evalTasks(tasks, gulp, compiled_config);
}
module.exports = exports["default"];