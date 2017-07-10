'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _gulpUtil = require("gulp-util");

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

var _traverse = require("traverse");

var _traverse2 = _interopRequireDefault(_traverse);

var _nunjucks = require("nunjucks");

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function objectTemplate(obj, context) {
    var tpl = new _nunjucks2.default.Environment(new _nunjucks2.default.FileSystemLoader('views'), {
        throwOnUndefined: true
    });
    context = _extends({}, context);
    (0, _traverse2.default)(obj).forEach(function (value) {
        if (_lodash2.default.isString(value)) {
            try {
                var rendered = tpl.renderString(value, context);
                // Обновляем контекст
                var paths = [this.path.join('.'), "_." + _lodash2.default.slice(this.path, 1).join('.')];
                _lodash2.default.each(paths, function (v) {
                    _lodash2.default.set(context, v, rendered);
                });

                this.update(rendered);
            } catch (err) {
                // Мб заглушить ошибку и сделать несколько проходов для ситуации с вложенными шаблонами
                var err = new _gulpUtil2.default.PluginError('objectTemplate', "Invalid template in " + this.path.join('.') + ": " + value + " \n                    ", { showStack: false });
                throw err;
            }
        }
    });
    return obj;
}

module.exports = objectTemplate;