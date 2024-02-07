import type { SerializeContext } from './serialize'

import { MutatorType } from '../enum/mutator-type'
import { NoTokenFound } from '../error/no-token-found'
import { SerializeVariableDefinition } from './serialize-variable-definition'
import { SerializeType } from './serialize-type'

export class SerializeVariableDefinitionOptional extends SerializeVariableDefinition {

  constructor(context: SerializeContext) {
    super(context)
  }

  public toString() {

    if (!this.name) {
      throw new NoTokenFound()
    }

    let result: string = this.applyMutationRule(MutatorType.VariableName, this.name)

    if (this.type) {
      result += `?: ${this.instance(SerializeType, this.type).toString()}`
    }

    if (this.repeated) {
      result += '[]'
    }

    return result
  }
}