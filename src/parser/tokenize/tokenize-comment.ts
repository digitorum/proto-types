import type { TokenData } from './tokenize'

import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'


export class TokenizeComment extends Tokenize {
  public apply(source: DataSource) {
    let result: TokenData[] = []
  
    while(source.nextChars(2) == '//') {
      // Игнорируем открывание комента
      source.readWhile(['/', ' '])

      const line = source.readLine()

      result.push({
        token: Token.Comment,
        content: line
      })
    }

    return result
  }
}