import type { TokenData } from '../../parser/tokenize/tokenize'

import { Serialize } from './serialize'
import { SerializeVariableAssign } from './serialize-variable-assign'

export class SerializeGlobalVar extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    return '// ' + new SerializeVariableAssign(this.tokens).toString()
  }
}
