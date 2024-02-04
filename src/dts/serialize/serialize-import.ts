import type { TokenData } from '../../parser/tokenize/tokenize'

import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeImport extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    return `// ${this.find(Token.Import)?.content} "${this.find(Token.DoubleQuotedString)?.content}"`
  }
}
