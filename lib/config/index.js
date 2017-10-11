'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _envs = require('../libs/envs');

var _envs2 = _interopRequireDefault(_envs);

var _options_renderer = require('../libs/options_renderer');

var _options_renderer2 = _interopRequireDefault(_options_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
  function Config(default_config) {
    _classCallCheck(this, Config);

    this._default_config = default_config;
  }

  _createClass(Config, [{
    key: 'get',
    value: function get(path, default_value) {
      return _lodash2.default.get(this.config, path, default_value);
    }
  }, {
    key: 'set',
    value: function set(path, value) {
      _lodash2.default.set(this.__config, path, value);
    }
  }, {
    key: 'render_config',
    value: function render_config(config) {
      var root = process.cwd();
      var options = _extends({}, this._default_config);
      try {
        options = (0, _deepmerge2.default)(options, config);
      } catch (err) {
        // noop
        console.error(err);
      }
      options.envs = _extends({}, options.envs, _envs2.default, { root: root });
      options = (0, _options_renderer2.default)(options);
      this.config = options;
      return options;
    }
  }, {
    key: 'config',
    get: function get() {
      return this.__config;
    },
    set: function set(config) {
      this.__config = config;
    }
  }]);

  return Config;
}();

exports.default = new Config(require('./default'));
module.exports = exports['default'];