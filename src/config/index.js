'use strict';

var _ = require('lodash');
var envs = require('../libs/envs');
var requireDir = require('require-dir');

import optionsRenderer from "../libs/options_renderer";
import deepmerge from 'deepmerge'

export default function (override_options) {
    var options = requireDir('./default');

    try {
        options = deepmerge(options, override_options);
    } catch (err) {
        // noop
    }
    options.envs = _.merge({}, options.envs, envs);
    options = optionsRenderer(options);
    return options;
}


