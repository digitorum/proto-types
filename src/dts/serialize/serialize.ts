import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { TokensDataStack } from '../tokens-data-stack'

type MutationActions = (content: string, context: SerializeContext) => string

export type SerializeConstructor = {
  new (context: SerializeContext): Serialize
}

export type SerializeContext = {
  namespace: string
  package: string;
}

export abstract class Serialize extends TokensDataStack {

  constructor(
    private context: SerializeContext
  ) {
    super()
  }

  static mutators: Record<MutatorType, MutationActions[]> = {
    [MutatorType.ImportFilePath]: [],
    [MutatorType.PackageNameToNamespace]: [],
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
      .reduce<string>((acc, fn) => fn(acc, this.context), value)

  }

  public instance(ctor: SerializeConstructor, tokens: TokenData[]) {
    return new ctor(this.context)
      .setTokens(tokens)
  }

  public abstract toString(): string;
}