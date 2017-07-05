'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.i18nExtension = i18nExtension;

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function i18nExtension() {
    // http://jinja.pocoo.org/docs/2.9/templates/#i18n
    this.tags = ['trans'];

    this.parse = function (parser, nodes, lexer) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(true, false);
        parser.advanceAfterBlockEnd(tok.value);

        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('endtrans');
        var pluralBody = null;

        if (parser.skipSymbol('pluralize')) {
            parser.skip(lexer.TOKEN_BLOCK_END);
            pluralBody = parser.parseUntilBlocks('endtrans');
        }

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'run', args, [body]);
    };

    this.run = function (context, body) {
        var safe = new _nunjucks2.default.runtime.SafeString('' + body());
        return safe;
    };
}