'use strict';
import _ from "lodash";
import humanize from "humanize";
import moment from "moment";
import {format as dateformat} from "dateformatter";
import _loadData from "../../libs/load_data";
import nunjucks from 'nunjucks'

import {i18nExtension} from '../../libs/nunjucks/i18n'
import {Jinja2Extension} from '../../libs/nunjucks/jinja2'


function loadData(name) {
    const options = require('../').project;
    return _loadData(name, options.template.context)
}

const EMPTY_FUNC = function () {
};

const filters = {
    jsonify: function (input) {
        return JSON.stringify(input);
    },
    filesizeformat: function (input) {
        return humanize.filesize(input);
    },
    floatformat: function (input, decimal_parts) {
        return humanize.numberFormat(input, decimal_parts)
    },
    intcomma: function (input) {
        return humanize.numberFormat(input, 2, ',', ' ')
    },
    date: function (input, format) {
        var dt = moment(input);
        return dateformat(format, dt);
    }

};


const globals = {
    static: function (url) {
        var static_root = '/static/';
        return static_root + url
    },
    url: function (url) {
        return url
    },
    _: function (str) {
        return str
    }
};

const extensions = {
    'i18n': i18nExtension,
    'jinja2': Jinja2Extension,
}

const manageEnvironment = function (env) {
};

const opts = {
    path: "{{ project.template.root }}",
    autoescape: true,
    throwOnUndefined: false,
    createEnv: function (template_options, global_config) {
        const {path, ...extra} = template_options;
        const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(path), extra);
        _.each({...filters, ...template_options.filters || {}}, function (func, name) {
            env.addFilter(name, func);
        });
        _.each({...globals, ...template_options.globals || {},}, function (value, name) {
            env.addGlobal(name, value)
        })
        _.each({...extensions, ...template_options.extensions || {}}, (value, name) => {
            env.addExtension(name, new value);
        })
        return env
    },

};

module.exports = opts;


