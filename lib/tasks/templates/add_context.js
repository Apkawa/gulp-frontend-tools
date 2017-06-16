'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (gulp, config) {
    var TEMPLATE_ROOT = config.project.template.root;
    var APP_ROOT = config.project.app_root;

    var CONTEXT_ROOT = config.project.template.context;

    gulp.task('templates:add_context', function () {
        return gulp.src(TEMPLATE_ROOT + '/**/*.{jinja2,html,j2}', { base: TEMPLATE_ROOT }).pipe(_gulpIgnore2.default.exclude(_ignore_template2.default)).pipe(add_context(CONTEXT_ROOT));
    });
};

var _load_data = require("../../libs/load_data");

var _load_data2 = _interopRequireDefault(_load_data);

var _gulpIgnore = require("gulp-ignore");

var _gulpIgnore2 = _interopRequireDefault(_gulpIgnore);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require("mkdirp");

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _throughGulp = require("through-gulp");

var _throughGulp2 = _interopRequireDefault(_throughGulp);

var _ignore_template = require("../../libs/ignore_template");

var _ignore_template2 = _interopRequireDefault(_ignore_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function add_context(context_root) {
    return (0, _throughGulp2.default)(function (file, encoding, callback) {
        var data = (0, _load_data2.default)(file.relative, context_root);
        if (data == null) {
            var parsed = _path2.default.parse(_path2.default.normalize(file.relative));
            var name = _path2.default.join(context_root, parsed.dir, parsed.name);
            var json_file_path = _path2.default.format({ name: name, ext: '.json' });
            (0, _mkdirp2.default)(_path2.default.parse(json_file_path).dir, function (err) {
                if (!err) {
                    _fs2.default.writeFile(json_file_path, "{}");
                }
            });
        }
        this.push(file);
        callback();
    });
}

module.exports = exports["default"];