'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _humanize = require('humanize');

var _humanize2 = _interopRequireDefault(_humanize);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _dateformatter = require('dateformatter');

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _i18n = require('../../libs/nunjucks/i18n');

var _jinja = require('../../libs/nunjucks/jinja2');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var filters = {
  jsonify: function jsonify(input) {
    return JSON.stringify(input);
  },
  filesizeformat: function filesizeformat(input) {
    return _humanize2.default.filesize(input);
  },
  floatformat: function floatformat(input, decimal_parts) {
    return _humanize2.default.numberFormat(input, decimal_parts);
  },
  intcomma: function intcomma(input) {
    return _humanize2.default.numberFormat(input, 2, ',', ' ');
  },
  date: function date(input, format) {
    console.log("INPUT", input);
    var dt = (0, _moment2.default)(input);
    return (0, _dateformatter.format)(format, dt);
  }

};

var globals = {
  static: function _static(url) {
    var static_root = '/static/';
    return static_root + url;
  },
  url: function url(_url) {
    return _url;
  },
  _: function _(str) {
    return str;
  }
};

var extensions = {
  'i18n': _i18n.i18nExtension,
  'jinja2': _jinja.Jinja2Extension
};

var opts = {
  path: '{{ project.template.root }}',
  autoescape: true,
  throwOnUndefined: false,
  globals: globals,
  filters: filters,
  extensions: extensions,
  createEnv: function createEnv(template_options, global_config) {
    var path = template_options.path,
        extra = _objectWithoutProperties(template_options, ['path']);

    var env = new _nunjucks2.default.Environment(new _nunjucks2.default.FileSystemLoader(path), extra);

    _lodash2.default.each(_extends({}, filters, template_options.filters || {}), function (func, name) {
      env.addFilter(name, func);
    });

    _lodash2.default.each(_extends({}, globals, template_options.globals || {}), function (value, name) {
      env.addGlobal(name, value);
    });

    _lodash2.default.each(_extends({}, extensions, template_options.extensions || {}), function (value, name) {
      env.addExtension(name, new value(env));
    });

    return env;
  }

};

exports.default = opts;
module.exports = exports['default'];