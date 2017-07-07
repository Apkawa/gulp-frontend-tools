'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i18nExtension = i18nExtension;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function i18nExtension() {
  // http://jinja.pocoo.org/docs/2.9/templates/#i18n
  this.tags = ['trans'];

  function parseSignature(parser, nodes, lexer) {
    var tok = parser.peekToken();
    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    var args = new nodes.NodeList(tok.lineno, tok.colno);

    var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);

    while (tok.type !== lexer.TOKEN_BLOCK_END) {
      var arg = parser.parseExpression();
      if (parser.skipValue(lexer.TOKEN_OPERATOR, '=')) {
        var attrName = arg.value;
        arg = new nodes.Literal(arg.lineno, arg.colno, attrName);
        kwargs.addChild(new nodes.Pair(arg.lineno, arg.colno, arg, parser.parseExpression()));
      } else {
        args.addChild(arg);
      }
      parser.skip(lexer.TOKEN_COMMA);
      tok = parser.peekToken();
    }

    if (kwargs.children.length) {
      args.addChild(kwargs);
    }
    return args;
  }

  this.parse = function (parser, nodes, lexer) {
    // get the tag token
    var tok = parser.nextToken();
    var name = tok.value;

    var args = parseSignature(parser, nodes, lexer);

    parser.advanceAfterBlockEnd(name);

    // parse the body and possibly the error block, which is optional
    var body = parser.parseUntilBlocks('pluralize', 'endtrans');
    var blocks = [body];

    if (parser.skipSymbol('pluralize')) {
      parser.skip(lexer.TOKEN_BLOCK_END);
      blocks.push(parser.parseUntilBlocks('endtrans'));
    }

    parser.advanceAfterBlockEnd();

    // See above for notes about CallExtension
    return new nodes.CallExtension(this, 'run', args, blocks);
  };

  this.run = function (context) {
    var kwargs = void 0,
        body = void 0,
        pluralBody = void 0;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (args.length == 1) {
      body = args[0];
    }
    if (args.length == 2) {
      kwargs = args[0];
      body = args[1];
    }
    if (args.length == 3) {
      kwargs = args[0];
      body = args[1];
      pluralBody = args[2];
    }

    _lodash2.default.each(kwargs, function (value, key) {
      if (key.startsWith('_')) {
        return;
      }
      context.setVariable(key, value);
    });
    var safe = new _nunjucks2.default.runtime.SafeString('' + body());
    return safe;
  };
}