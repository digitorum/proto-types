import type { TokenData } from '../../parser/tokenize/tokenize'

import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeComment } from './serialize-comment'
import { SerializeVariableAssign } from './serialize-variable-assign'
import { Token } from '../../parser/enum/token'

export class SerializeEnum extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    let result: string = ''

    do {
      const td = this.tokens.shift()

      if (!td) {
        throw new NoTokenFound()
      }

      switch(td.token) {
        case Token.Enum: {
          result += 'enum '
          break
        }

        case Token.EnumName: {
          result += `${td.content} `
          break
        }

        case Token.EnumBodyStart: {
          result += '{\n'
          break
        }

        case Token.Comment: {
          result += `${new SerializeComment([td]).toString()}`
          break
        }

        case Token.VariableName: {
          const enumValue = new SerializeVariableAssign([td].concat(this.flatReadUntil(Token.SemicolonSymbol)))
            .toString()

          result += `${enumValue},\n`
          break
        }

        case Token.EnumBodyEnd: {
          result += '}\n'
          break
        }
      }
    } while (this.tokens.length)

    return result
  }
}
