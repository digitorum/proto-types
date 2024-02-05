import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { Serialize } from './serialize'
import { SerializeVariableAssign } from './serialize-variable-assign'

export class SerializeGlobalVar extends Serialize {
  constructor(tokens: TokenData[], context: SerializeContext) {
    super(tokens, context)
  }

  public toString() {
    return '// ' + this.instance(SerializeVariableAssign, this.tokens).toString()
  }
}
