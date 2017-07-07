'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requireDir = require('require-dir');

var _requireDir2 = _interopRequireDefault(_requireDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_config = (0, _requireDir2.default)('.');
default_config.webpack = require('./webpack');

exports.default = default_config;
module.exports = exports['default'];