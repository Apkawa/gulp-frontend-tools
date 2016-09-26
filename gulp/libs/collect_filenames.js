'use strict';
var _ = require('lodash');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

function collect_filenames(entry_root, glob_expr) {
    var files = glob.sync(entry_root + glob_expr);
    var points = {};
    _.forEach(files, function (v) {
        var parsed = path.parse(path.normalize(v));
        var dirname = _.slice(parsed.dir, path.normalize(entry_root).length).join('');
        var name = path.join(dirname, parsed.name);
        points[name] = v
    });
    return points
}

module.exports = collect_filenames;