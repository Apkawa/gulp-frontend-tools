'use strict'
import _ from 'lodash'
import requireDir from 'require-dir'
import deepmerge from 'deepmerge'
import envs from '../libs/envs'
import optionsRenderer from '../libs/options_renderer'

import webpackOptions from './default/webpack'

export default function (override_options) {
  const root = process.cwd()
  let options = requireDir('./default')

  options.webpack = webpackOptions
  try {
    options = deepmerge(options, override_options)
  } catch (err) {
    // noop
    console.error(err)
  }
  options.envs = {...options.envs, ...envs, root}
  options = optionsRenderer(options)
  return options
}


