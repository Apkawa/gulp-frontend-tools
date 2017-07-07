'use strict'
import _ from 'lodash'
import nunjucks from 'nunjucks'

export function i18nExtension () {
  // http://jinja.pocoo.org/docs/2.9/templates/#i18n
  this.tags = ['trans']

  function parseSignature (parser, nodes, lexer) {
    let tok = parser.peekToken()
    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    const args = new nodes.NodeList(tok.lineno, tok.colno)

    const kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno)

    while (tok.type !== lexer.TOKEN_BLOCK_END) {
      let arg = parser.parseExpression()
      if (parser.skipValue(lexer.TOKEN_OPERATOR, '=')) {
        const attrName = arg.value
        arg = new nodes.Literal(arg.lineno, arg.colno, attrName)
        kwargs.addChild(
          new nodes.Pair(arg.lineno, arg.colno, arg, parser.parseExpression()),
        )
      } else {
        args.addChild(arg)
      }
      parser.skip(lexer.TOKEN_COMMA)
      tok = parser.peekToken()
    }

    if (kwargs.children.length) {
      args.addChild(kwargs)
    }
    return args
  }

  this.parse = function (parser, nodes, lexer) {
    // get the tag token
    var tok = parser.nextToken()
    const name = tok.value

    const args = parseSignature(parser, nodes, lexer)

    parser.advanceAfterBlockEnd(name)

    // parse the body and possibly the error block, which is optional
    const body = parser.parseUntilBlocks('pluralize', 'endtrans')
    const blocks = [body]

    if (parser.skipSymbol('pluralize')) {
      parser.skip(lexer.TOKEN_BLOCK_END)
      blocks.push(parser.parseUntilBlocks('endtrans'))
    }

    parser.advanceAfterBlockEnd()

    // See above for notes about CallExtension
    return new nodes.CallExtension(this, 'run', args, blocks)
  }

  this.run = function (context, ...args) {
    let kwargs, body, pluralBody
    if (args.length == 1) {
      [body] = args
    }
    if (args.length == 2) {
      [kwargs, body] = args
    }
    if (args.length == 3) {
      [kwargs, body, pluralBody] = args
    }

    _.each(kwargs, (value, key) => {
      if (key.startsWith('_')) {
        return
      }
      context.setVariable(key, value)
    })
    const safe = new nunjucks.runtime.SafeString(`${body()}`)
    return safe
  }
}


