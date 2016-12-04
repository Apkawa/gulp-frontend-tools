'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getWebpackEntry;

var _collect_filenames = require('./collect_filenames');

var _collect_filenames2 = _interopRequireDefault(_collect_filenames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');
var path = require('path');
function getWebpackEntry(config) {
    var project = config.project;
    var webpack_options = config.webpack;

    var ENTRY_ROOT = project.path.app.webpack_entry_root || path.join(project.path.app.js, 'entry');
    var entryPoints = _.fromPairs(_.map((0, _collect_filenames2.default)(ENTRY_ROOT, '**/*.js?(x)'), function (f, n) {
        return [n, [f, 'webpack/hot/dev-server', 'webpack-hot-middleware/client']];
    }));

    console.log(entryPoints);
    return _.merge({}, entryPoints, webpack_options.entry);
}
module.exports = exports['default'];