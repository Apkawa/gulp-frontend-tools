'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var nodeEnv = process.env.NODE_ENV;

function getEnvs() {
  root = process.cwd();
  var lib_root = _path2.default.dirname(_path2.default.dirname(__dirname));

  var _gutil$env = _gulpUtil2.default.env,
      _ = _gutil$env._,
      envs = _objectWithoutProperties(_gutil$env, ['_']);

  envs = _extends({}, envs, {
    lib_root: lib_root,
    root: root
  });

  envs.is_production = envs.type === 'production' || nodeEnv === 'production' || Boolean(_gulpUtil2.default.env.production);
  envs.debug = !envs.is_production;
  return envs;
}

exports.default = getEnvs();
module.exports = exports['default'];