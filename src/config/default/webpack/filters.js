'use strict'
import _ from 'lodash'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import envs from '../../../libs/envs'

export function productionFilter (webpack_options, config) {
  if (!envs.is_production) {
    return webpack_options
  }
  console.log('Production')
  return {
    ...webpack_options,
    cache: false,
    watch: false,
    devtool: false,
    plugins: [
      ...webpack_options.plugins,
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        beautify: false,
        comments: false,
        sourceMap: false,
        compress: {
          warnings: false,
          drop_console: true,
          unsafe: true,
        },
      }),
    ],
  }
}

export function hotFilter (webpack_options, config) {
  const project_webpack = _.get(config, 'project.webpack', {})
  if (project_webpack.hot && envs.debug) {
    webpack_options.devServer = {
      hot: true,
    }
    webpack_options.entry = _.fromPairs(_.map(webpack_options.entry,
      (f, n) => [
        n, [
          f,
          'webpack/hot/dev-server',
          'webpack-hot-middleware/client',
        ]],
      ),
    )
    webpack_options.plugins.push(new webpack.HotModuleReplacementPlugin())
  }
  return webpack_options
}

export function extractCss (webpack_options, config) {
  const extract_css = _.get(config, 'project.webpack.extract_css')
  if (extract_css) {
    const {filename, options} = extract_css

    webpack_options.module.rules = _.map(webpack_options.module.rules, (o) => {
      const {test, use: loaders} = o
      if (test.test('.css') || test.test('.less') || test.test('.scss') || test.test('.sass')) {
        const use = ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: _.map(_.slice(loaders, 1), (l) => l),
        })
        return {
          test, use,
        }
      }
      return o
    })
    webpack_options.plugins.push(new ExtractTextPlugin({filename: filename, ...options}))
  }
  return webpack_options
}

export function definesFilter (webpack_options, config) {
  const defines = _.get(config, 'project.webpack.defines', {})
  webpack_options.plugins.unshift(
    new webpack.DefinePlugin(defines),
  )
  return webpack_options

}
export function sassFilter (webpack_options, config) {
  const context = _.get(config, 'project.context')
  if (_.isEmpty(context)) {
    return webpack_options
  }
  webpack_options.module.rules = _.map(webpack_options.module.rules, (o) => {
    const {test, use, ..._o} = o
    if (!(test.test('.scss') || test.test('.sass'))) {
      return o
    }
    return {
      test,
      ..._o,
      use: _.map(use, (loader) => {
        if (_.isString(loader) && loader === 'sass-loader') {
          loader = {
            loader,
            options: {},
            ..._o
          }
        }
        if (loader.loader === 'sass-loader') {
          const defineData = _.join(_.map(context, (v, k) => `$${k}: ${JSON.stringify(v)};`), '\n;')
          loader.options.data = (loader.options.data || '') + defineData
        }
        return loader
      }),
    }
  })
  return webpack_options
}

export function bundleAnalyzerFilter (webpack_options, config) {
  let bundleAnalyzerOptions = _.get(config, 'project.webpack.bundle_analyzer')
  if (bundleAnalyzerOptions && env.debug) {
    if (!_.isPlainObject(bundleAnalyzerOptions)) {
      bundleAnalyzerOptions = {}
    }
    webpack_options.plugins.push(new BundleAnalyzerPlugin(bundleAnalyzerOptions))
  }
  return webpack_options
}

export function providePluginFilter (webpack_options, config) {
  const providePlugin = _.get(webpack_options, 'providePlugin', {})
  webpack_options.plugins.push(
    new webpack.ProvidePlugin({
      ...providePlugin,
      Promise: 'es6-promise',
    }))
  delete webpack_options.providePlugin
  return webpack_options

}

export function lodashFilter (webpack_options, config) {
  new LodashModuleReplacementPlugin({
    'collections': true,
    'paths': true,
    'shorthands': true,
    ..._.get(webpack_options, 'lodashPlugin')
  })
  delete webpack_options.lodashPlugin
  return webpack_options
}

export default  [
  productionFilter,
  hotFilter,
  definesFilter,
  sassFilter,
  providePluginFilter,
  extractCss,
  bundleAnalyzerFilter,
  lodashFilter,
]

