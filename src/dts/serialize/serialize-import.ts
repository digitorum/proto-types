import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeImport extends Serialize {
  public path: string

  constructor(context: SerializeContext) {
    super(context)

    this.path = ''
  }

  public setTokens(tokens: TokenData[]) {
    Serialize.prototype.setTokens.call(this, tokens)

    this.path = this.find(Token.DoubleQuotedString)?.content ?? ''

    return this
  }

  public toString() {
    return `// ${this.find(Token.Import)?.content} "${this.path}"`
  }
}
