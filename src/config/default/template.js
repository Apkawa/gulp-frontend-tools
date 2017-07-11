'use strict'
import _ from 'lodash'
import humanize from 'humanize'
import moment from 'moment'
import { format as dateformat } from 'dateformatter'
import nunjucks from 'nunjucks'

import { i18nExtension } from '../../libs/nunjucks/i18n'
import { Jinja2Extension } from '../../libs/nunjucks/jinja2'

const filters = {
  jsonify: function (input) {
    return JSON.stringify(input)
  },
  filesizeformat: function (input) {
    return humanize.filesize(input)
  },
  floatformat: function (input, decimal_parts) {
    return humanize.numberFormat(input, decimal_parts)
  },
  intcomma: function (input) {
    return humanize.numberFormat(input, 2, ',', ' ')
  },
  date: function (input, format) {
    console.log("INPUT", input)
    var dt = moment(input)
    return dateformat(format, dt)
  },

}

const globals = {
  static: function (url) {
    var static_root = '/static/'
    return static_root + url
  },
  url: function (url) {
    return url
  },
  _: function (str) {
    return str
  },
}

const extensions = {
  'i18n': i18nExtension,
  'jinja2': Jinja2Extension,
}

const opts = {
  root: '{{ project.app_root }}/templates/',
  context_root: '{{ project.app_root }}/templates_context/',
  dist: '{{ project.dist_root }}/templates/',

  autoescape: true,
  throwOnUndefined: false,
  globals,
  filters,
  extensions,
  createEnv: function (template_options, global_config) {
    const {root, ...extra} = template_options
    const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(root), extra)

    _.each({...filters, ...template_options.filters || {}}, function (func, name) {
      env.addFilter(name, func)
    })

    _.each({...globals, ...template_options.globals || {},}, function (value, name) {
      env.addGlobal(name, value)
    })

    _.each({...extensions, ...template_options.extensions || {}}, (value, name) => {
      env.addExtension(name, new value(env))
    })

    return env
  },

}

export default opts