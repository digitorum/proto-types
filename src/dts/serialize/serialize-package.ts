import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializePackage extends Serialize {
  public namespace: string

  constructor(context: SerializeContext) {
    super(context)

    this.namespace = ''
  }

  public setTokens(tokens: TokenData[]) {
    Serialize.prototype.setTokens.call(this, tokens)

    this.name = this.find(Token.PackageName)?.content ?? ''
    this.namespace = this.applyMutationRule(MutatorType.PackageNameToNamespace, this.name)

    return this
  }

  public toString() {
    return `// ${this.find(Token.Package)?.content} = ${this.name}`
  }
}
