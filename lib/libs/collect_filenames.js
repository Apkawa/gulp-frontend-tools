'use strict';

var _ = require('lodash');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

function collect_filenames(entry_root, glob_expr) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var relativeDir = opts.relativeDir;

    var files = glob.sync(entry_root + glob_expr);
    var points = {};

    _.forEach(files, function (v) {
        var _path$parse = path.parse(path.normalize(v)),
            dir = _path$parse.dir,
            name = _path$parse.name,
            base = _path$parse.base;

        var dirname = _.slice(dir, path.normalize(entry_root).length).join('');
        var entry_name = path.join(dirname, name);

        var file_path = v;
        if (relativeDir) {
            file_path = './' + path.join(_.slice(dir, path.normalize(relativeDir || "").length).join(''), base);
        }
        points[entry_name] = file_path;
    });
    return points;
}

module.exports = collect_filenames;