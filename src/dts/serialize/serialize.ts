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
  public name: string

  protected parent: Serialize | null

  private scoped: Serialize[]

  constructor(
    private context: SerializeContext
  ) {
    super()

    this.parent = null
    this.name = ''
    this.scoped = []
  }

  destructor() {
    this.parent = null

    this.scoped.forEach((scoped) => scoped.destructor())
  }

  static mutators: Record<MutatorType, MutationActions[]> = {
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

  public get scopedName(): string {
    if (this.parent && this.parent.scopedName) {
      return `${this.parent.scopedName}__${this.name}`
    }

    return this.name
  }

  public belongsTo(parent: Serialize) {
    this.parent = parent

    return this
  }

  public addToScope(inst: Serialize) {
    this.scoped.push(inst.belongsTo(this))
  }

  public findNameInScope(name: string): string {
    const inHere = this.scoped.filter((inst) => inst.name === name)

    if (inHere.length === 0) {
      if (this.parent) {
        return this.parent.findNameInScope(name)
      }
    } else if (inHere.length === 1) {
      return inHere[0].scopedName
    }

    return name
  }

  public applyToScope<R>(fn: (inst: Serialize) => R): R[] {
    return this.scoped.map((node) => fn(node))
  }

  public abstract toString(): string;
}