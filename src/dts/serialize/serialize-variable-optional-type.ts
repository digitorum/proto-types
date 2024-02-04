import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeVariableOptionalType extends Serialize {

  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    const name = this.find(Token.VariableName)
    const type = this.find(Token.VariableType)
    const repeated = this.find(Token.VariableRepeated)

    if (!name) {
      throw new NoTokenFound()
    }

    let result: string = this.applyMutationRule(MutatorType.VariableName, name.content)

    if (type) {
      result += `?: ${this.applyMutationRule(MutatorType.VariableType, type.content)}`
    }

    if (repeated) {
      result += '[]'
    }

    return result
  }
}