import type { TokenData } from './tokenize'

import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'

export class TokenizeComment extends Tokenize {
  public apply(source: DataSource) {
    let result: TokenData[] = []

    if (source.nextChars(2) == '//') {
      source.readChars(2) // Игнорируем открывание комента
      source.readEmptyCharacters()

      const line = source.readLine()

      result.push({
        token: Token.Comment,
        content: line
      })
    }

    if (source.nextChars(3) === '/**') {
      source.readChars(3)

      let completed = false
      let comment = ''

      while(!completed) {
        const chr = source.readChar()

        if (chr === '*' && source.nextChar === '/') {
          source.readChar()
          completed = true
        } else {
          comment += chr
        }
      }

      result.push({
        token: Token.MultilineComment,
        content: comment
      })
    }

    return result
  }
}