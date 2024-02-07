import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeValue } from './serialize-value'
import { Token } from '../../parser/enum/token'

export class SerializeEnumElement extends Serialize {

  private value: TokenData | null

  constructor(context: SerializeContext) {
    super(context)

    this.value = null
  }

  public setTokens(tokens: TokenData[]) {
    Serialize.prototype.setTokens.call(this, tokens)

    this.name = this.find(Token.VariableName)?.content ?? ''
    this.value = this.findFirstOf([Token.Number, Token.DoubleQuotedString])

    return this
  }

  public toString() {
    if (!this.name) {
      throw new NoTokenFound()
    }

    let result: string = this.name

    if (this.value) {
      result += ' = ' + this.instance(SerializeValue, [this.value]).toString()
    }

    return result
  }
}