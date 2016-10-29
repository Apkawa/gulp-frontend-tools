'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = optionsRenderer;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectTemplate = require('./objectTemplate');

var _objectTemplate2 = _interopRequireDefault(_objectTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optionsRenderer(data) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { depth: 10 };

    var context = _extends({}, data);
    var exlcudes = opts.exlcudes,
        depth = opts.depth;

    for (var i = 0; i < depth; i++) {
        data = _lodash2.default.fromPairs(_lodash2.default.map(data, function (value, key) {
            // Local root context
            if (!_lodash2.default.includes(exlcudes, key)) {
                var templated_value = {};
                templated_value[key] = value;
                context['_'] = value;
                context['_key'] = key;

                value = (0, _objectTemplate2.default)(templated_value, context)[key];
                context[key] = value;
            }
            return [key, value];
        }));
    }
    return data;
}
module.exports = exports['default'];