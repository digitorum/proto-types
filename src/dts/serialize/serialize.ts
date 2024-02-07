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

  private scope: string[]

  constructor(
    private context: SerializeContext
  ) {
    super()

    this.scope = []
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

  public instance<T extends SerializeConstructor>(ctor: T, tokens: TokenData[]): InstanceType<T> {
    return (new ctor(this.context) as InstanceType<T>)
      .setTokens(tokens)
  }

  public setScope(scope: string[]) {
    this.scope = scope

    return this
  }

  public getScopedName(name: string) {
    return [...this.scope, name].join('__')
  }

  public abstract toString(): string;
}