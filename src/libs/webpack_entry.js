'use strict';
var _ = require('lodash')
var path = require('path');
import collect_filenames from "./collect_filenames";

export default function getWebpackEntry(config) {
    const project = config.project;
    const webpack_options = config.webpack;

    const ENTRY_ROOT = project.path.app.webpack_entry_root || path.join(project.path.app.js, 'entry');
    const entryPoints = collect_filenames(ENTRY_ROOT, '**/*.js?(x)')
    return _.merge({}, entryPoints, webpack_options.entry);
}
