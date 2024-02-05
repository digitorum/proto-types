import type { TokenData } from './tokenize'

import { DataSource } from '../../data-source/data-source'
import { Tokenize } from './tokenize'
import { TokenizeComment } from './tokenize-comment'
import { TokenizeServiceRpc } from './tokenize-service-rpc'

export class TokenizeServiceBody extends Tokenize {
  constructor() {
    super()
  }

  public apply(source: DataSource) {
    let result: TokenData[] = []

    TICK: while(1) {
      source.readEmptyCharacters()

      if (source.nextChar === '}') {
        return result
      }

      if (source.nextChars(3) === 'rpc') {
        result = result.concat(new TokenizeServiceRpc().apply(source))
        continue TICK
      }

      if (source.nextChars(2) === '//') {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      if (source.nextChars(3) === '/**') {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      throw "NULL"
    }

    return []
  }

}
