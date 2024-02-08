import type { SerializeContext, SerializeConstructor } from './serialize/serialize'
import type { TokenData } from '../parser/tokenize/tokenize'

import { DataSource } from '../data-source/data-source'
import { Lexer } from '../parser/lexer'
import { SerializeComment } from './serialize/serialize-comment'
import { SerializeEnum } from './serialize/serialize-enum'
import { SerializeGlobalVar } from './serialize/serialize-global-var'
import { SerializeImport } from './serialize/serialize-import'
import { SerializeMessage } from './serialize/serialize-message'
import { SerializePackage } from './serialize/serialize-package'
import { SerializeService } from './serialize/serialize-service'
import { Token } from '../parser/enum/token'
import { TokensDataStack } from './tokens-data-stack'

export class DtsFile extends TokensDataStack {
  private namespace: string
  private package: string;

  constructor() {
    super()

    this.namespace = ''
    this.package = ''
  }

  private get context(): SerializeContext {
    return {
      namespace: this.namespace,
      package: this.package
    }
  }

  public parse(src: DataSource) {
    const tokens = new Lexer(src).parse()

    this.setTokens(tokens)

    const {
      imports,
      source
    } = this.perform()

    return {
      imports,
      source
    }
  }

  private getSerializerInstance<T extends SerializeConstructor>(
    ctor: T,
    tokens: TokenData[]
  ) {
    return (new ctor(this.context) as InstanceType<T>)
      .setTokens(tokens)
  }

  public perform() {
    let imports: string[] = []
    let source: string = ''

    TICK: while(this.tokens.length) {
      switch(this.tokens[0].token) {

        case Token.VariableName: {
          source += this.getSerializerInstance(SerializeGlobalVar, this.flatReadUntil(Token.SemicolonSymbol)).toString()
          source += '\n'
          continue TICK
        }
  
        case Token.Package: {
          const pckg = this.getSerializerInstance(SerializePackage, this.flatReadUntil(Token.SemicolonSymbol))

          this.namespace = pckg.namespace
          this.package = pckg.name

          source += pckg.toString()
          source += '\n'
          continue TICK
        }

        case Token.VariableTypeDefinitionStart: {
          source += this.getSerializerInstance(SerializeGlobalVar, this.flatReadUntil(Token.SemicolonSymbol)).toString()
          source += '\n'
          continue TICK
        }

        case Token.Import: {
          const imprt = this.getSerializerInstance(SerializeImport, this.flatReadUntil(Token.SemicolonSymbol))

          imports.push(imprt.path)

          continue TICK
        }

        case Token.Comment: {
          source += this.getSerializerInstance(SerializeComment, this.flatReadUntil(Token.Comment)).toString()
          source += '\n'
          continue TICK
        }

        case Token.MultilineComment: {
          source += this.getSerializerInstance(SerializeComment, this.flatReadUntil(Token.MultilineComment)).toString()
          source += '\n'
          continue TICK
        }

        case Token.MessageStart: {
          const message = this.getSerializerInstance(SerializeMessage, this.blockRead(Token.MessageStart, Token.MessageBodyEnd))

          source += message.toString()
          source += '\n'
          continue TICK
        }

        case Token.Enum: {
          source += this.getSerializerInstance(SerializeEnum, this.blockRead(Token.Enum, Token.EnumBodyEnd)).toString()
          source += '\n'
          continue TICK
        }

        case Token.ServiceDefinitionStart: {
          source += this.getSerializerInstance(SerializeService, this.flatReadUntil(Token.ServiceDefinitionEnd)).toString()
          source += '\n'
          continue TICK
        }

        default: {
          throw this.tokens[0].token
        }
      }
    }

    return {
      imports,
      source: `namespace ${this.namespace} { ${source} }`
    }
  }

}
