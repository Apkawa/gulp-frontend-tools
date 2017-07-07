'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadData = loadData;
exports.loadContext = loadContext;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _jsYaml = require("js-yaml");

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _gulpUtil = require("gulp-util");

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadData(name, context_root) {
  var parsed = _path2.default.parse(_path2.default.normalize(name));
  name = _path2.default.join(parsed.dir, parsed.name);

  var context_path = context_root + name;

  var _context = null;
  var ext_list = ['.js', '.yaml', '.json'];
  for (var index in ext_list) {
    var ext = ext_list[index];
    var _fname = context_path + ext;
    //console.log('_fname', _fname);
    try {
      if (ext == '.yaml') {
        _context = _jsYaml2.default.safeLoad(_fs2.default.readFileSync(_fname, 'utf8'));
      } else {
        // Try context from js file
        if (ext == '.json') {
          _context = JSON.parse(_fs2.default.readFileSync(_fname, 'utf8'));
        } else {
          _context = require(_fname);
        }
      }
      break;
    } catch (err) {
      // Try context from json file
    }
  }
  if (_lodash2.default.isEmpty(_context)) {
    _gulpUtil2.default.log(_gulpUtil2.default.colors.cyan(name), _gulpUtil2.default.colors.yellow('Не найден контекст'));
  }
  return _context;
}

function loadContext(name) {
  return loadData(name, config.get('template.context'));
}

exports.default = loadData;