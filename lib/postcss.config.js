'use strict';

module.exports = function (_ref) {
  var _ref$options = _ref.options,
      env = _ref$options.env,
      config = _ref$options.config;

  var postcssOptions = config.get('postcss');
  return {
    plugins: {
      'autoprefixer': postcssOptions.autoprefixer || false,
      'cssnano': postcssOptions.cssnano || false
    }
  };
};