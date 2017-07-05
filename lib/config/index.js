'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (override_options) {
  var options = (0, _requireDir2.default)('./default');
  options.webpack = _webpack2.default;
  try {
    options = (0, _deepmerge2.default)(options, override_options);
  } catch (err) {
    // noop
  }
  options.envs = _lodash2.default.merge({}, options.envs, _envs2.default);
  options = (0, _options_renderer2.default)(options);
  return options;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requireDir = require('require-dir');

var _requireDir2 = _interopRequireDefault(_requireDir);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _envs = require('../libs/envs');

var _envs2 = _interopRequireDefault(_envs);

var _options_renderer = require('../libs/options_renderer');

var _options_renderer2 = _interopRequireDefault(_options_renderer);

var _webpack = require('./default/webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];