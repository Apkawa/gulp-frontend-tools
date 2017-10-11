'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requireDir = require('require-dir');

var _requireDir2 = _interopRequireDefault(_requireDir);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function evalTasks(wrap_func, gulp, compiled_config) {
  if (_lodash2.default.isFunction(wrap_func)) {
    wrap_func(gulp, compiled_config);
  } else {
    _lodash2.default.each(wrap_func, function (f) {
      evalTasks(f, gulp, compiled_config);
    });
  }
}

var Tools = function () {
  function Tools(gulp, config) {
    _classCallCheck(this, Tools);

    this.gulp = gulp;
    this.raw_config = config;
    this.tasks = this._collectTasks();
    this._configHook = [];
  }

  _createClass(Tools, [{
    key: '_collectTasks',
    value: function _collectTasks() {
      return (0, _requireDir2.default)('./tasks', { recurse: true });
    }
  }, {
    key: 'task',
    value: function task(name, func) {
      this.tasks[name] = func;
      return this;
    }
  }, {
    key: 'configHook',
    value: function configHook(func) {
      this._configHook.push(func);
      return this;
    }
  }, {
    key: 'run',
    value: function run() {
      var compiled_config = _config2.default.render_config(this.raw_config);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._configHook[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var func = _step.value;

          compiled_config = func(compiled_config, this.raw_config);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      evalTasks(this.tasks, this.gulp, compiled_config);
    }
  }]);

  return Tools;
}();

exports.default = function (gulp, config) {
  return new Tools(gulp, config);
};

module.exports = exports['default'];