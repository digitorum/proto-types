import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeComment } from './serialize-comment'
import { SerializeEnumElement } from './serialize-enum-element'
import { Token } from '../../parser/enum/token'

export class SerializeEnum extends Serialize {
  constructor(context: SerializeContext) {
    super(context)
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
          result += 'export enum '
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

        case Token.Comment:
        case Token.MultilineComment: {
          result += `${this.instance(SerializeComment, [td]).toString()}\n`
          break
        }

        case Token.VariableName: {
          const enumValue = this.instance(SerializeEnumElement, [td].concat(this.flatReadUntil(Token.SemicolonSymbol)))
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
