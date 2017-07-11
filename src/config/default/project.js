'use strict'

const options = {
  project_root: '{{ envs.root }}',
  static_root: '/static/',
  app_root: '{{ _.project_root }}/app',
  dist_root: '{{ _.project_root }}/dist',
  path: {
    node_modules: '{{ envs.root }}/node_modules/',
    app: {
      css: '{{ _.app_root }}/styles/',
      scss: '{{ _.path.app.css }}',
      images: '{{ _.app_root }}/images/',
      js: '{{ _.app_root }}/scripts/',
      public: [
        '{{ _.app_root }}/public/',
      ],
    },
    dist: {
      js: '{{ _.dist_root }}/js',
      css: '{{ _.dist_root }}/css',
      img: '{{ _.dist_root }}/img',
      source_maps: '{{ _.dist_root }}/_maps/',
    },
  },
}

module.exports = options