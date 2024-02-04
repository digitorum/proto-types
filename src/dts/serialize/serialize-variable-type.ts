import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeType } from './serialize-type'
import { Token } from '../../parser/enum/token'

export class SerializeVariableType extends Serialize {

  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    const name = this.find(Token.VariableName)
    const type = this.flatFindBlock(Token.VariableTypeDefinitionStart, Token.VariableTypeDefinitionEnd)
    const repeated = this.find(Token.VariableRepeated)

    if (!name) {
      throw new NoTokenFound()
    }

    let result: string = this.applyMutationRule(MutatorType.VariableName, name.content)

    if (type) {
      result += `: ${new SerializeType(type).toString()}`
    }

    if (repeated) {
      result += '[]'
    }

    return result
  }
}