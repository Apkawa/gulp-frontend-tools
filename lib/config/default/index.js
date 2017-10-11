'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _requireDir = require('require-dir');

var _requireDir2 = _interopRequireDefault(_requireDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_config = (0, _requireDir2.default)('.');
default_config.webpack = require('./webpack');

var EXTRA_OPTS = {
  sprite: {
    // example_sprite: {
    //   root: '{{ project.path.app.images }}/sprites/',
    //   // Static path to image
    //   imgRoot: '{{ project.static_root }}/img/',
    //   // Full path to sprite
    //   imgPath: '{{ project.path.app.public[0] }}/images/_example_sprite.png',
    //   stylePath: '{{ project.path.app.scss }}/_example_sprite.scss'
    //   suffix: 'icons-',
    // },
  },
  'sass-image': {
    // images: {
    //   root: '{{ project.path.app.public[0] }}/img/',
    //   http_images_path: '{{ project.static_root }}/img/',
    //   includeBase64: false,
    //   suffix: 'img-',
    // },
  },
  sass: {
    includePaths: ['{{ project.path.app.scss }}', '{{ project.path.node_modules }}']
  },
  scss_lint: {
    'config': '{{ envs.lib_root }}/.scss-lint.yml',
    'maxBuffer': 2048 * 1024
  },
  context: {
    'STATIC_ROOT': '{{ project.static_root }}'
  },
  eslint: {
    configFile: '{{ envs.lib_root }}/.eslintrc'
  }

};

exports.default = _extends({}, default_config, EXTRA_OPTS);
module.exports = exports['default'];