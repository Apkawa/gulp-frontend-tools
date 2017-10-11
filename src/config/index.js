'use strict'
import _ from 'lodash'
import deepmerge from 'deepmerge'
import envs from '../libs/envs'
import optionsRenderer from '../libs/options_renderer'

class Config {
  constructor (default_config) {
    this._default_config = default_config
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
    let options = {...this._default_config}
    try {
      options = deepmerge(options, config)
    } catch (err) {
      // noop
      console.error(err)
    }
    options.envs = {...options.envs, ...envs, root}
    options = optionsRenderer(options)
    this.config = options
    return options
  }
}

export default new Config(require('./default'))


