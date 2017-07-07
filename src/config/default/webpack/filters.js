'use strict'
import _ from 'lodash'
import path from 'path'
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import envs from '../../../libs/envs'

function getProjectWebpack (config) {
  return _.omit(_.get(config, 'webpack', {}), ['getConfig', 'config'])
}

export function productionFilter (webpack_options, config) {
  if (!envs.is_production) {
    return webpack_options
  }
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
  const project_webpack = getProjectWebpack(config)
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
  const modify_rules = (loaders) => {
    const opts = {
      fallback: loaders[0],
      use: _.map(_.slice(loaders, 1), (l) => l),
    }
    return ExtractTextPlugin.extract(opts)
  }
  const extract_css = _.get(getProjectWebpack(config), 'extract_css')
  if (!extract_css) {
    return webpack_options
  }

  const {filename = '/common.css', options = {}} = extract_css

  webpack_options.module.rules = _.map(webpack_options.module.rules, (loader_rule) => {
    const {test, use: loaders, oneOf, rules} = loader_rule

    if (test.test('.css') || test.test('.less') || test.test('.scss') || test.test('.sass') || test.test('.styl')) {
      const [key, subRules] = _.filter(_.map({oneOf, rules}, (v, k) => v ? [k, v] : v))[0] || [undefined, undefined]
      if (key) {
        return {
          test,
          [key]: _.map(subRules, ({use, ..._l}) => ({use: modify_rules(use), ..._l})),
        }
      }
      return {
        test, use: modify_rules(loaders),
      }
    }
    return loader_rule
  })
  webpack_options.plugins.push(
    new ExtractTextPlugin({
      filename: filename,
      allChunks: true,
      ...options
    }))
  return webpack_options
}

export function definesFilter (webpack_options, config) {
  const defines = _.get(getProjectWebpack(config), 'defines', {})
  webpack_options.plugins.unshift(
    new webpack.DefinePlugin(defines),
  )
  return webpack_options

}
export function sassFilter (webpack_options, config) {
  const updateLoaders = (loader) => {
    if (_.isArray(loader)) {
      return _.map(loader, updateLoaders)
    }
    if (_.isString(loader) && loader === 'sass-loader') {
      loader = {
        loader,
        options: {},
      }
    }
    if (loader.loader === 'sass-loader') {
      const defineData = _.join(_.map(context, (v, k) => `$${k}: ${JSON.stringify(v)};`), '\n;')
      loader.options.data = (loader.options.data || '') + defineData
    }
    return loader
  }

  const context = _.get(config, 'project.context')
  if (_.isEmpty(context)) {
    return webpack_options
  }
  webpack_options.module.rules = _.map(webpack_options.module.rules, (o) => {
    const {test, use, oneOf, rules, ..._o} = o
    if (!(test.test('.scss') || test.test('.sass'))) {
      return o
    }

    const [key, _rules] = _.filter(_.map({oneOf, rules}, (v, k) => v ? [k, v] : v))[0] || [undefined, undefined]
    console.log(key, rules)
    if (key) {
      return {
        test,
        ..._o,
        [key]: _.map(_rules, ({use, ...r}) => ({use: updateLoaders(use), ...r})),
      }
    }
    console.log(_o)
    return {
      test,
      ..._o,
      use: updateLoaders(use),
    }
  })
  return webpack_options
}

export function bundleAnalyzerFilter (webpack_options, config) {
  let bundleAnalyzerOptions = _.get(getProjectWebpack(config), 'bundle_analyzer')
  console.log(bundleAnalyzerOptions)
  if (bundleAnalyzerOptions) {
    if (!_.isPlainObject(bundleAnalyzerOptions)) {
      bundleAnalyzerOptions = {}
    }
    webpack_options.plugins.push(new BundleAnalyzerPlugin(bundleAnalyzerOptions))
  }
  return webpack_options
}

export function providePluginFilter (webpack_options, config) {
  const providePlugin = _.get(getProjectWebpack(config), 'providePlugin', {})
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
    ..._.get(getProjectWebpack(config), 'lodashPlugin')
  })
  delete webpack_options.lodashPlugin
  return webpack_options
}

export function commonChunkFilter (webpack_options, config) {
  config = _.get(getProjectWebpack(config), 'commonChunk', 'common.js')
  if (!config) {
    return webpack_options
  }
  if (_.isString(config)) {
    config = {
      name: path.basename(config, '.js'),
      filename: config,
      minChunks: 2,
    }
  }

  webpack_options.plugins.push(
    new webpack.optimize.CommonsChunkPlugin(config),
  )
  return webpack_options
}

export default  [
  productionFilter,
  hotFilter,
  definesFilter,
  sassFilter,
  providePluginFilter,
  lodashFilter,
  commonChunkFilter,
  extractCss,
  bundleAnalyzerFilter,
]
