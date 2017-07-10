'use strict'
import _ from 'lodash'
import nunjucks from 'nunjucks'

export class i18nExtension {

  // http://jinja.pocoo.org/docs/2.9/templates/#i18n
  tags = ['trans']
  globals = {
    get_current_language() {
      return 'ru'
    },
    get_available_languages() {
      return [['ru', 'Russian'], ['en', 'English']]
    },
    get_language_info() {
      return {
        'name': 'Russian',
        'name_local': 'Русский',
        'code': 'ru',
        'bidi': false,
      }
    },
  }

  constructor (env) {
    _.each(this.globals, (v, name) => env.addGlobal(name, v))
  }

  parseSignature (parser, nodes, lexer) {
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

  parse (parser, nodes, lexer) {
    // get the tag token
    var tok = parser.nextToken()
    const name = tok.value

    const args = this.parseSignature(parser, nodes, lexer)

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

  run (context, ...args) {
    let kwargs, body, pluralBody
    if (args.length === 1) {
      [body] = args
    }
    if (args.length === 2) {
      [kwargs, body] = args
    }
    if (args.length === 3) {
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


