'use strict';

var _ = require('lodash');
var humanize = require('humanize');

var moment = require('moment');
var dateformat = require('dateformatter').format;


var _loadData = require('../../libs/load_data');

function loadData(name) {
    var options = require('../').project;
    return _loadData(name, options.template.context)
}

var EMPTY_FUNC = function () {
}

var filters = {
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

}



var globals = {
    static: function (url) {
        var static_root = '/static/';
        return static_root + url
    },
    url: function (url) {
        return url
    },
}

var manageEnvironment = function (env) {
    _.each(filters, function (func, name) {
        env.addFilter(name, func);
    });
    _.each(globals, function (value, name) {
        env.addGlobal(name, value)

    })
}

var opts = {
    path: "{{ project.template.root }}",
    manageEnv: manageEnvironment

};

module.exports = opts;


