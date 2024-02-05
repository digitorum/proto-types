import { DataSource } from '../../data-source/data-source'
import { SyntaxError } from '../error/syntax-error'
import { Token } from '../../parser/enum/token'
import { TokenData } from './tokenize'
import { Tokenize } from './tokenize'

export class TokenizeBlockEnd extends Tokenize {
  constructor(
    private asToken: Token
  ) {
    super()
  }

  public apply(source: DataSource) {
    let result: TokenData[] = []

    const char = source.readChar()

    if (char !== '}') {
      throw new SyntaxError()
    }

    result.push({
      token: this.asToken,
      content: char
    })

    source.readEmptyCharacters()

    if (source.nextChar === ';') {
      source.readChar()
    }

    return result
  }
}
