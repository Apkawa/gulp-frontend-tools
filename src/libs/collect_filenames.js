'use strict';
var _ = require('lodash');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

function collect_filenames(entry_root, glob_expr, opts = {}) {
    const {relativeDir} = opts;
    const files = glob.sync(entry_root + glob_expr);
    const points = {};

    _.forEach(files, function (v) {
        const {dir, name, base}= path.parse(path.normalize(v));
        var dirname = _.slice(dir, path.normalize(entry_root).length).join('');
        const entry_name = path.join(dirname, name);

        let file_path = v;
        if (relativeDir) {
            file_path = './' + path.join(
                    _.slice(dir, path.normalize(relativeDir || "").length).join(''),
                    base)
        }
        points[entry_name] = file_path
    });
    return points
}

module.exports = collect_filenames;