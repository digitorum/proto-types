import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { TokensDataStack } from '../tokens-data-stack'

type MutationActions = (content: string) => string
export abstract class Serialize extends TokensDataStack {

  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  static mutators: Record<MutatorType, MutationActions[]> = {
    [MutatorType.VariableName]: [],
    [MutatorType.VariableType]: []
  }

  static addMutationRule(type: MutatorType, actions: MutationActions) {
    Serialize.mutators[type].push(actions)
  }

  protected applyMutationRule(type: MutatorType, value: string) {
    if (!Serialize.mutators[type].length) {
      return value
    }

    return Serialize.mutators[type]
      .reduce<string>((acc, fn) => fn(acc), value)

  }

  public abstract toString(): string;
}