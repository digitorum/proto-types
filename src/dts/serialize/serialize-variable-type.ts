import type { TokenData } from '../../parser/tokenize/tokenize'

import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeVariableType extends Serialize {

  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public addVariableTypeMutationRule() {
    return this
  }

  public toString() {
    const name = this.find(Token.VariableName)
    const type = this.find(Token.VariableType)
    const repeated = this.find(Token.VariableRepeated)

    if (!name) {
      throw new NoTokenFound()
    }

    let result: string = name?.content ?? ''

    if (type) {
      result += `: ${type.content}`
    }

    if (repeated) {
      result += '[]'
    }

    return result
  }
}