'use strict'

module.exports = ({options: {env, config}}) => {
  const postcssOptions = config().get('postcss', {})
  return {
    plugins: {
      'autoprefixer': postcssOptions.autoprefixer || false,
      'cssnano': {zindex: false},
    },
  }
}
