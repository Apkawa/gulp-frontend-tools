'use strict'
import _ from 'lodash'
import deepmerge from 'deepmerge'
import envs from '../libs/envs'
import optionsRenderer from '../libs/options_renderer'

function overwriteMerge (destinationArray, sourceArray, options) {
  return sourceArray
}

function oldArrayMerge (target, source, optionsArgument) {
  const destination = target.slice()

  source.forEach(function (e, i) {
    if (typeof destination[i] === 'undefined') {
      const cloneRequested = !optionsArgument || optionsArgument.clone !== false
      const shouldClone = cloneRequested && isMergeableObject(e)
      destination[i] = shouldClone ? clone(e, optionsArgument) : e
    } else if (isMergeableObject(e)) {
      destination[i] = merge(target[i], e, optionsArgument)
    } else if (target.indexOf(e) === -1) {
      destination.push(e)
    }
  })
  return destination
}

class Config {
  constructor (defaultConfig) {
    this._defaultConfig = defaultConfig
  }

  get (path, default_value) {
    return _.get(this.config, path, default_value)
  }

  set (path, value) {
    _.set(this.__config, path, value)
  }

  get config () {
    return this.__config
  }

  set config (config) {
    this.__config = config
  }

  render_config (config) {
    const root = process.cwd()
    let options = {...this._defaultConfig}
    try {
      options = deepmerge(options, config)
    } catch (err) {
      // noop
      console.error(err)
      throw err
    }
    options.envs = {...options.envs, ...envs, root}
    options = optionsRenderer(options)
    this.config = options
    return options
  }
}

export default new Config(require('./default'))


