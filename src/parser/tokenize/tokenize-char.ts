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

      console.log(source.nextChars(20))

      throw new SyntaxError(`Expect char "${this.char}" but received "${char}"`)
    }

    return [
      {
        token: this.asToken,
        content: char
      }
    ]
  }

}
