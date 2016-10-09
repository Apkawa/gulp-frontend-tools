'use strict';
var gulp = require('gulp');

var _ = require('lodash');
var envs = require('../libs/envs');
var requireDir = require('require-dir');

var objectTemplate = require('../libs/objectTemplate');

import optionsRenderer from '../libs/options_renderer';


function getOptions() {
    var options = requireDir('./default');

    try {
        options = _.merge({}, options, requireDir('./' + envs.project));
    } catch (err) {
        // noop
    }

    options.envs = envs;
    options = optionsRenderer(options)

    return options;
}

module.exports = getOptions();

