import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeType } from './serialize-type'
import { Token } from '../../parser/enum/token'

export class SerializeVariableDefinition extends Serialize {

  protected type: TokenData[] | null
  protected repeated: TokenData | null

  constructor(context: SerializeContext) {
    super(context)

    this.type = null
    this.repeated = null
  }

  public setTokens(tokens: TokenData[]) {
    Serialize.prototype.setTokens.call(this, tokens)

    this.name = this.find(Token.VariableName)?.content ?? ''
    this.type = this.flatFindBlock(Token.VariableTypeDefinitionStart, Token.VariableTypeDefinitionEnd)
    this.repeated = this.find(Token.VariableRepeated)

    return this
  }

  public toString() {

    if (!this.name) {
      throw new NoTokenFound()
    }

    let result: string = this.applyMutationRule(MutatorType.VariableName, this.name)

    if (this.type) {
      result += `: ${this.instance(SerializeType, this.type).belongsTo(this).toString()}`
    }

    if (this.repeated) {
      result += '[]'
    }

    return result
  }
}