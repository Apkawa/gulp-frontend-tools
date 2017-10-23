'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getWebpackEntry;

var _collect_filenames = require('./collect_filenames');

var _collect_filenames2 = _interopRequireDefault(_collect_filenames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWebpackEntry(config) {
  var webpackOptions = config.webpack;
  var entryRoot = webpackOptions.entry_root,
      extraEntryPoints = webpackOptions.entry_points;

  var entryPoints = (0, _collect_filenames2.default)(entryRoot, '**/*.js?(x)');
  return _extends({}, entryPoints, webpackOptions.entry, extraEntryPoints);
}
module.exports = exports['default'];