'use strict';
var gulp = require('gulp');

var _ = require('lodash');
var envs = require('../libs/envs');
var requireDir = require('require-dir');

var objectTemplate = require('../libs/objectTemplate');

function renderOptions(options) {
    var _ = require('lodash');
    var context = _.cloneDeep(options);
    var option_priority = ['project']

    var sorted = _.sortBy(_.map(options, function (value, key) {
            return [key, value]

        }),
        function (obj) {
            var i = option_priority.indexOf(obj[0]);
            if (i < 0) {
                return 1000
            }
            return i
        });
    return _.fromPairs(_.map(sorted, function (o) {
        var key = o[0];
        var value = o[1];
        // Local root context
        if (!_.includes(['envs', 'browserSync'], key)) {
            context._ = value
            var templated_value = {}
            templated_value[key] = value;
            value = objectTemplate(templated_value, context)[key];
            context[key] = value
        }
        return [key, value]

    }))
}

function getOptions() {
    var options = requireDir('./default');

    try {
        options = _.merge({}, options, requireDir('./' + envs.project));
    } catch (err) {
        // noop
    }

    options.envs = envs;
    options = renderOptions(options)
    return options;
}

module.exports = getOptions();

