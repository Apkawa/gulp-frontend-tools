'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i18nExtension = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var i18nExtension = exports.i18nExtension = function () {

  // http://jinja.pocoo.org/docs/2.9/templates/#i18n
  function i18nExtension(env) {
    _classCallCheck(this, i18nExtension);

    this.tags = ['trans'];
    this.globals = {
      get_current_language: function get_current_language() {
        return 'ru';
      },
      get_available_languages: function get_available_languages() {
        return [['ru', 'Russian'], ['en', 'English']];
      },
      get_language_info: function get_language_info() {
        return {
          'name': 'Russian',
          'name_local': 'Русский',
          'code': 'ru',
          'bidi': false
        };
      }
    };

    _lodash2.default.each(this.globals, function (v, name) {
      return env.addGlobal(name, v);
    });
  }

  _createClass(i18nExtension, [{
    key: 'parseSignature',
    value: function parseSignature(parser, nodes, lexer) {
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
  }, {
    key: 'parse',
    value: function parse(parser, nodes, lexer) {
      // get the tag token
      var tok = parser.nextToken();
      var name = tok.value;

      var args = this.parseSignature(parser, nodes, lexer);

      parser.advanceAfterBlockEnd(name);

      // parse the body and possibly the error block, which is optional
      var body = parser.parseUntilBlocks('pluralize', 'endtrans');
      var blocks = [body];
      var pluralizeArgs = null;
      if (parser.skipSymbol('pluralize')) {
        pluralizeArgs = this.parseSignature(parser, nodes, lexer);
        parser.skip(lexer.TOKEN_BLOCK_END);
        blocks.push(parser.parseUntilBlocks('endtrans'));
      }

      parser.advanceAfterBlockEnd();

      // See above for notes about CallExtension
      return new nodes.CallExtension(this, 'run', args, blocks);
    }
  }, {
    key: 'run',
    value: function run(context) {
      var kwargs = void 0,
          body = void 0,
          pluralBody = void 0;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (args.length === 1) {
        body = args[0];
      }
      if (args.length === 2) {
        kwargs = args[0];
        body = args[1];
      }
      if (args.length === 3) {
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
    }
  }]);

  return i18nExtension;
}();