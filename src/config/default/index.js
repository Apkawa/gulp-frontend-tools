'use strict'
import requireDir from 'require-dir'

const default_config = requireDir('.')
default_config.webpack = require('./webpack')

const EXTRA_OPTS = {
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
    includePaths: [
      '{{ project.path.app.scss }}',
      '{{ project.path.node_modules }}',
    ],
  },
  scss_lint: {
    'config': '{{ envs.lib_root }}/.scss-lint.yml',
    'maxBuffer': 2048 * 1024,
  },
  context: {
    'STATIC_ROOT': '{{ project.static_root }}',
  },
  eslint: {
    configFile: '{{ envs.lib_root }}/.eslintrc',
  },

}

export default {
  ...default_config,
  ...EXTRA_OPTS
}