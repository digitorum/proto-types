import * as prettier from "prettier"

import { DataSource } from '../data-source/data-source'
import { DataSourceFile } from '../data-source/data-source-file'
import { Lexer } from '../parser/lexer'
import { SerializeComment } from './serialize/serialize-comment'
import { SerializeEnum } from './serialize/serialize-enum'
import { SerializeGlobalVar } from './serialize/serialize-global-var'
import { SerializeImport } from './serialize/serialize-import'
import { SerializeMessage } from './serialize/serialize-message'
import { SerializePackage } from './serialize/serialize-package'
import { Token } from '../parser/enum/token'
import { TokensDataStack } from './tokens-data-stack'

export class DtsFile extends TokensDataStack {

  private namespace: string = ''

  constructor(datasource: DataSource) {
    super()

    this.tokens = new Lexer(datasource).parse()
  }

  public async perform() {
    let result: string = ''

    TICK: while(this.tokens.length) {
      switch(this.tokens[0].token) {

        case Token.VariableName: {
          result += new SerializeGlobalVar(this.flatReadUntil(Token.SemicolonSymbol)).toString()
          result += '\n'
          continue TICK
        }
  
        case Token.Package: {
          const pckg = new SerializePackage(this.flatReadUntil(Token.SemicolonSymbol))

          this.namespace = pckg.namespace

          result += pckg.toString()
          result += '\n'
          continue TICK
        }

        case Token.VariableTypeDefinitionStart: {
          result += new SerializeGlobalVar(this.flatReadUntil(Token.SemicolonSymbol)).toString()
          result += '\n'
          continue TICK
        }

        case Token.Import: {
          const imprt = new SerializeImport(this.flatReadUntil(Token.SemicolonSymbol))

          result += imprt.toString()
          result += '\n'

          const dtsFile = new DtsFile(new DataSourceFile(imprt.path))
          const source = await dtsFile.perform()

          // console.log(source)

          continue TICK
        }

        case Token.Comment: {
          result += new SerializeComment(this.flatReadUntil(Token.Comment)).toString()
          result += '\n'
          continue TICK
        }

        case Token.MultilineComment: {
          result += new SerializeComment(this.flatReadUntil(Token.MultilineComment)).toString()
          result += '\n'
          continue TICK
        }

        case Token.MessageStart: {
          const message = new SerializeMessage(this.blockRead(Token.MessageStart, Token.MessageBodyEnd))

          result += message.toString()
          result += '\n'
          continue TICK
        }

        case Token.Enum: {
          result += new SerializeEnum(this.blockRead(Token.Enum, Token.EnumBodyEnd)).toString()
          result += '\n'
          continue TICK
        }

        default: {
          throw this.tokens[0].token
        }
      }
    }

    result = `export namespace ${this.namespace} { ${result} }`

    return await prettier.format(result, {
      "trailingComma": "none",
      "singleQuote": true,
      "parser": "typescript"
    })
  }

}
