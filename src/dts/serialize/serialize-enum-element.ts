import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeValue } from './serialize-value'
import { Token } from '../../parser/enum/token'

export class SerializeEnumElement extends Serialize {
  constructor(tokens: TokenData[], context: SerializeContext) {
    super(tokens, context)
  }

  public get name() {
    return this.find(Token.VariableName)
  }
  
  public get value() {
    return this.findFirstOf([Token.Number, Token.DoubleQuotedString])
  }
  
  public toString() {
    if (!this.name) {
      throw new NoTokenFound()
    }

    let result: string = this.name.content

    if (this.value) {
      result += ' = ' + this.instance(SerializeValue, [this.value]).toString()
    }

    return result
  }
}