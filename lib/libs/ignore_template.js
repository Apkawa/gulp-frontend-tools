'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (file) {
    /* ignore partials like sass */
    var parts = _lodash2.default.filter(file.path.split('/'), function (part) {
        return part.startsWith("_");
    });
    if (parts.length) {
        return true;
    }
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
module.exports = exports['default'];