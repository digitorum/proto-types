import type { TokenData } from './tokenize'

import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'

// Все что находится внутри нас не интересует, в типы это никак не пойдет, поэтому просто сливаем весь блок в никуда

export class TokenizeRpcBody extends Tokenize {
  constructor() {
    super()
  }

  public apply(source: DataSource): TokenData[] {
    let count = 0
    let content: string = ''

    while(1) {
      const char = source.nextChar

      if (char === '{') {
        count++
      }

      if (char === '}') {
        count--

        if (count < 0) {
          break
        }

        if (count === 0) {
          content += source.readChar()
          if (source.nextChar === ';') {
            content += source.readChar()
          }

          break
        }
      }

      content += source.readChar()
    }

    return [
      {
        token: Token.RpcBody,
        content
      }
    ]
  }
}