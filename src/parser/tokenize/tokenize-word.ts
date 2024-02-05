import { DataSource } from '../../data-source/data-source'
import { SyntaxError } from '../error/syntax-error'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'

export class TokenizeWord extends Tokenize {
  constructor(
    private asToken: Token,
    private pattern: string | null = null
  ) {
    super()
  }

  public apply(source: DataSource) {
    const word = source.readWord()

    if (!word) {
      throw new SyntaxError()
    }

    if (this.pattern && word !== this.pattern) {
      throw new SyntaxError()
    }

    return [
      {
        token: this.asToken,
        content: word
      }
    ]
  }
}