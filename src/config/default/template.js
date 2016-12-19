'use strict';
import _ from "lodash";
import humanize from "humanize";
import moment from "moment";
import {format as dateformat} from "dateformatter";
import _loadData from "../../libs/load_data";


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
};

const manageEnvironment = function (env) {
    _.each(filters, function (func, name) {
        env.addFilter(name, func);
    });
    _.each(globals, function (value, name) {
        env.addGlobal(name, value)

    })
};

const opts = {
    path: "{{ project.template.root }}",
    manageEnv: manageEnvironment

};

module.exports = opts;


