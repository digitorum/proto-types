import type { TokenData } from '../../parser/tokenize/tokenize'

import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeValue } from './serialize-value'
import { Token } from '../../parser/enum/token'

export class SerializeEnumElement extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    const name = this.find(Token.VariableName)
    const value = this.findFirstOf([Token.Number, Token.DoubleQuotedString])

    if (!name) {
      throw new NoTokenFound()
    }

    let result: string = name.content

    if (value) {
      result += ' = ' + new SerializeValue([value]).toString()
    }

    return result
  }
}