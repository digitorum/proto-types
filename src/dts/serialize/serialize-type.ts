import type { SerializeContext } from './serialize'

import { MutatorType } from '../enum/mutator-type'
import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'
import { TypeConvertationFailed } from '../error/type-convertation-failed'

export class SerializeType extends Serialize {
  constructor(context: SerializeContext) {
    super(context)
  }

  public toString() {
    this.tokens.shift()

    // явное указание типа
    if (this.tokens[0].token === Token.VariableType) {
      const fullTypeName = this.findNameInScope(this.tokens[0].content)

      return this.applyMutationRule(MutatorType.VariableType, fullTypeName)
    }

    // указание типа как map
    if (this.tokens[0].token === Token.VariableTypeMap) {
      const key = this.find(Token.VariableTypeMapKey)
      const valueFullTypeName = this.findNameInScope(this.find(Token.VariableTypeMapValue)?.content ?? '')

      if (!key || !valueFullTypeName) {
        throw new NoTokenFound()
      }

      return `Record<${this.applyMutationRule(MutatorType.VariableType, key.content)}, ${this.applyMutationRule(MutatorType.VariableType, valueFullTypeName)}>`
    }

    throw new TypeConvertationFailed()
  }
}
