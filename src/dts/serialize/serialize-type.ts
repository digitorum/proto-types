import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeType extends Serialize {
  constructor(tokens: TokenData[], context: SerializeContext) {
    super(tokens, context)
  }

  public toString() {
    this.tokens.shift()

    // явное указание типа
    if (this.tokens[0].token === Token.VariableType) {
      return this.applyMutationRule(MutatorType.VariableType, this.tokens[0].content)
    }

    // указание типа как map
    if (this.tokens[0].token === Token.VariableTypeMap) {
      const key = this.find(Token.VariableTypeMapKey)
      const value = this.find(Token.VariableTypeMapValue)

      if (!key || !value) {
        throw new NoTokenFound()
      }

      return `Record<${this.applyMutationRule(MutatorType.VariableType, key.content)}, ${this.applyMutationRule(MutatorType.VariableType, value.content)}>`
    }

    throw new NoTokenFound() // TODO: заменить
  }
}
