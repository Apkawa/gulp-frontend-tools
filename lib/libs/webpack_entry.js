'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getWebpackEntry;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _collect_filenames = require('./collect_filenames');

var _collect_filenames2 = _interopRequireDefault(_collect_filenames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWebpackEntry(config) {
  var webpack_options = config.webpack;
  var ENTRY_ROOT = webpack_options.entry_root;
  var entryPoints = (0, _collect_filenames2.default)(ENTRY_ROOT, '**/*.js?(x)');
  return _extends({}, entryPoints, webpack_options.entry);
}
module.exports = exports['default'];