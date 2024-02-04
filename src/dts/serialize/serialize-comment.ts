import type { TokenData } from '../../parser/tokenize/tokenize'

import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeComment extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    return `// ${this.find(Token.Comment)?.content}\n`
  }
}
