import * as prettier from "prettier"
import camelCase from 'lodash.camelcase'

import { DataSource } from '../data-source/data-source'
import { Lexer } from '../parser/lexer'
import { MutatorType } from './enum/mutator-type'
import { Serialize } from './serialize/serialize'
import { SerializeComment } from './serialize/serialize-comment'
import { SerializeEnum } from './serialize/serialize-enum'
import { SerializeGlobalVar } from './serialize/serialize-global-var'
import { SerializeImport } from './serialize/serialize-import'
import { SerializeMessage } from './serialize/serialize-message'
import { SerializePackage } from './serialize/serialize-package'
import { Token } from '../parser/enum/token'
import { TokensDataStack } from './tokens-data-stack'

Serialize.addMutationRule(MutatorType.VariableName, (value) => {
  return camelCase(value)
})

Serialize.addMutationRule(MutatorType.VariableType, (value) => {
  const map: Record<string, string> = {
    bool: 'boolean',
    uint32: 'number',
    'google.protobuf.Timestamp': 'string'
  }

  return map[value] ?? value
})

export class DtsGenerator extends TokensDataStack {

  constructor(datasource: DataSource) {
    super()

    this.tokens = new Lexer(datasource).parse()
  }

  public async generate() {
    let result: string = ''

    TICK: while(this.tokens.length) {
      switch(this.tokens[0].token) {

        case Token.VariableName: {
          result += new SerializeGlobalVar(this.flatReadUntil(Token.SemicolonSymbol)).toString()
          result += '\n'
          continue TICK
        }
  
        case Token.Package: {
          result += new SerializePackage(this.flatReadUntil(Token.SemicolonSymbol)).toString()
          result += '\n'
          continue TICK
        }

        case Token.VariableTypeDefinitionStart: {
          result += new SerializeGlobalVar(this.flatReadUntil(Token.SemicolonSymbol)).toString()
          result += '\n'
          continue TICK
        }
        case Token.Import: {
          result += new SerializeImport(this.flatReadUntil(Token.SemicolonSymbol)).toString()
          result += '\n'
          continue TICK
        }

        case Token.Comment: {
          result += new SerializeComment(this.flatReadUntil(Token.Comment)).toString()
          result += '\n'
          continue TICK
        }

        case Token.MessageStart: {
          result += new SerializeMessage(this.blockRead(Token.MessageStart, Token.MessageBodyEnd)).toString()
          result += '\n'
          continue TICK
        }

        case Token.Enum: {
          result += new SerializeEnum(this.blockRead(Token.Enum, Token.EnumBodyEnd)).toString()
          result += '\n'
          continue TICK
        }

        default: {
          throw this.tokens[0]
        }
      }
    }

    console.log(await prettier.format(result, {
      "trailingComma": "none",
      "singleQuote": true,
      "parser": "typescript"
    }))
  }

}
