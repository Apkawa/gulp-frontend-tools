'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getWebpackEntry;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _collect_filenames = require("./collect_filenames");

var _collect_filenames2 = _interopRequireDefault(_collect_filenames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWebpackEntry(config) {
    var project = config.project;
    var webpack_options = config.webpack;

    var ENTRY_ROOT = project.path.app.webpack_entry_root || _path2.default.join(project.path.app.js, 'entry');
    var entryPoints = (0, _collect_filenames2.default)(ENTRY_ROOT, '**/*.js?(x)');
    return _lodash2.default.merge({}, entryPoints, webpack_options.entry);
}
module.exports = exports["default"];