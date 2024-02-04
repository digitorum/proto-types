import { DataSource } from '../../data-source/data-source'
import { SyntaxError } from '../error/syntax-error'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'

export class TokenizeChar extends Tokenize {
  constructor(
    private char: string,
    private asToken: Token
  ) {
    super()
  }

  public apply(source: DataSource) {
    const char = source.readChar()

    if (char !== this.char) {
      throw new SyntaxError()
    }

    return [
      {
        token: this.asToken,
        content: char
      }
    ]
  }

}
