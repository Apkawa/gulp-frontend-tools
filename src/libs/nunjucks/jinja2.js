'use strict';

export function Jinja2Extension() {
    // http://jinja.pocoo.org/docs/2.9/templates/#i18n
    this.tags = ['with'];

    this.parse = function (parser, nodes, lexer) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('endwith');
        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'with', args, [body]);
    };

    this.with = function (context, args, body) {
        try {
            return body();
        } catch (ex) {
            //
        }
    };
}


