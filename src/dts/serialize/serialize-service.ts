import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeService extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString(): string {
    return 'SERVICE'
  }

}
