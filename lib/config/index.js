'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (override_options) {
    var options = requireDir('./default');

    try {
        options = _.merge({}, options, override_options);
    } catch (err) {
        // noop
    }
    options.envs = _.merge({}, options.envs, envs);
    options = (0, _options_renderer2.default)(options);
    return options;
};

var _options_renderer = require('../libs/options_renderer');

var _options_renderer2 = _interopRequireDefault(_options_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var envs = require('../libs/envs');
var requireDir = require('require-dir');

module.exports = exports['default'];