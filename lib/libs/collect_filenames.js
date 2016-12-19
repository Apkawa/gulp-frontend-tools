'use strict';

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function collect_filenames(entry_root, glob_expr) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var relativeDir = opts.relativeDir;

    var files = _glob2.default.sync(entry_root + glob_expr);
    var points = {};

    _lodash2.default.forEach(files, function (v) {
        var _path$parse = _path2.default.parse(_path2.default.normalize(v)),
            dir = _path$parse.dir,
            name = _path$parse.name,
            base = _path$parse.base;

        var dirname = _lodash2.default.slice(dir, _path2.default.normalize(entry_root).length).join('');
        var entry_name = _path2.default.join(dirname, name);

        var file_path = v;
        if (relativeDir) {
            file_path = './' + _path2.default.join(_lodash2.default.slice(dir, _path2.default.normalize(relativeDir || "").length).join(''), base);
        }
        points[entry_name] = file_path;
    });
    return points;
}

module.exports = collect_filenames;