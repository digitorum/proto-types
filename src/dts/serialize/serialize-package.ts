import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializePackage extends Serialize {
  constructor(tokens: TokenData[], context: SerializeContext) {
    super(tokens, context)
  }

  public get name() {
    return this.find(Token.PackageName)?.content ?? ''
  }

  public get namespace() {
    return this.applyMutationRule(MutatorType.PackageNameToNamespace, this.name)
  }

  public toString() {
    return `// ${this.find(Token.Package)?.content} = ${this.name}`
  }
}
