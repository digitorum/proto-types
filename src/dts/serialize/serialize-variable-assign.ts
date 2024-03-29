import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { NoTokenFound } from '../error/no-token-found'
import { SerializeType } from './serialize-type'
import { SerializeValue } from './serialize-value'
import { SerializeVariableDefinition } from './serialize-variable-definition'
import { Token } from '../../parser/enum/token'

export class SerializeVariableAssign extends SerializeVariableDefinition {
  private value: TokenData | null

  constructor(context: SerializeContext) {
    super(context)

    this.value = null
  }

  public setTokens(tokens: TokenData[]) {
    SerializeVariableDefinition.prototype.setTokens.call(this, tokens)

    this.value = this.findFirstOf([Token.Number, Token.DoubleQuotedString])

    return this
  }

  public toString() {

    if (!this.name) {
      throw new NoTokenFound()
    }

    let result: string = this.applyMutationRule(MutatorType.VariableName, this.name)

    if (this.type) {
      result += `: ${this.instance(SerializeType, this.type).toString()}`
    }

    if (this.repeated) {
      result += '[]'
    }

    if (this.value) {
      result += ' = ' + this.instance(SerializeValue, [this.value]).toString()
    }

    return result
  }
}