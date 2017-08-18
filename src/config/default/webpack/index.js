/**
 * Created by apkawa on 28.08.16.
 */
import webpack from 'webpack'

import _ from 'lodash'
import gutil from 'gulp-util'

import StringReplacePlugin from 'string-replace-webpack-plugin'

import envs from '../../../libs/envs'
import webpackEntry from '../../../libs/webpack_entry'
import FILTERS from './filters'

const cssLoader = (importLoaders = 0, modules = undefined) => ({
    loader: 'css-loader',
    query: {
      modules,
      importLoaders,
      sourceMap: true,
      localIdentName: envs.is_production
        ? '[hash:base64]'
        : '[path]__[name]__[local]--[hash:base64:5]'
    }
  }
)
const styleLoader = {
  loader: 'style-loader',
  options: {
    sourceMap: true
  }
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    config: {
      ctx: {
        env: gutil.env,
        config: () => require('../../')
      }
    }
  }
}

const EXTRA_OPTIONS = {
  hot: true,
  gzip: false,
  eslint: false,
  uglify: true,
  babel_minify: false,
  urlLimit: 100000,
  bundle_analyzer: envs.bundle_analyzer,
  providePlugin: {},
  entry_root: '{{ project.path.app.js }}/entry/',
  entry_points: {},
  defines: {
    'STATIC_ROOT': '"{{ project.static_root }}"',
    'process.env': {
      NODE_ENV: JSON.stringify(envs.is_production ? 'production' : 'developerment')
    }
  },
  publicPath: '{{ project.static_root }}js/',
  commonChunk: 'common.js',
  extract_css: {
    filename: 'common.css',
    options: {
      allChunks: true
    }
  }
}

const WEBPACK_OPTIONS = {
  cache: true,
  watch: false,
  devtool: 'cheap-module-eval-source-map',
  entry: {},
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },

  output: {
    path: '{{ project.path.dist.js }}',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '{{ webpack.publicPath }}',
    sourceMapFilename: '../_maps/[file].map'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /vendors/],
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /\?module/,
            use: [
              styleLoader,
              cssLoader(1, true),
              postcssLoader
            ]
          },
          {
            use: [
              styleLoader,
              cssLoader(1),
              postcssLoader

            ]
          }
        ]
      },
      {
        test: /\.less$/,
        oneOf: [
          {
            resourceQuery: /\?module/,
            use: [
              styleLoader,
              cssLoader(2, true),
              postcssLoader,
              'less-loader'
            ]
          },
          {
            use: [
              styleLoader,
              cssLoader(2),
              postcssLoader,
              'less-loader'
            ]
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        oneOf: [
          {
            resourceQuery: /\?module/,
            use: [
              styleLoader,
              cssLoader(3, true),
              postcssLoader,
              'sass-loader',
              'import-glob-loader'
            ]
          },
          {
            use: [
              styleLoader,
              cssLoader(3),
              postcssLoader,
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              },
              'import-glob-loader'
            ]

          }
        ]
      },
      {
        test: /\.styl$/,
        oneOf: [
          {
            resourceQuery: /\?module/,
            use: [
              styleLoader,
              cssLoader(2, true),
              postcssLoader,
              'stylus-loader'
            ]
          },
          {
            use: [
              styleLoader,
              cssLoader(2),
              postcssLoader,
              'stylus-loader'
            ]
          }
        ]

      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: '{{ _.urlLimit }}',
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: '{{ _.urlLimit }}',
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: '{{ _.urlLimit }}',
          mimetype: 'image/svg+xml'
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: '{{ _.urlLimit }}',
              name: 'images/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(swig|html)$/,
        loader: 'html-loader'
      }
    ],
    noParse: /\.min\.js/
  },
  resolve: {
    modules: [
      '{{ project.path.app.js }}',
      '{{ project.app_root }}',
      '{{ project.project_root }}',
      '{{ project.path.node_modules }}'
    ],
    extensions: ['.js', '.jsx'],
    alias: {}
  },
  plugins: [
    new StringReplacePlugin()
  ],
  node: {
    fs: 'empty',
    file: 'empty',
    directory: 'empty',
    debug: 'empty',
    net: 'empty',
    child_process: 'empty'
  }
}

let __COMPILED

function getConfig (config) {
  if (__COMPILED) {
    return __COMPILED
  }
  let webpack_options = _.get(config, 'webpack.config')
  webpack_options.entry = webpackEntry(config)

  for (let filter of FILTERS) {
    try {
      webpack_options = filter(webpack_options, config)
    } catch (err) {
      throw err

    }
  }
  __COMPILED = webpack_options
  return webpack_options
}

export default {
  getConfig,
  ...EXTRA_OPTIONS,
  config: WEBPACK_OPTIONS
}
