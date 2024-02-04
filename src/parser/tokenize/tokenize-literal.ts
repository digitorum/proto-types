import { DataSource } from '../../data-source/data-source'
import { SyntaxError } from '../error/syntax-error'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'

export class TokenizeLiteral extends Tokenize {
  constructor(
    private asToken: Token
  ) {
    super()
  }

  public apply(source: DataSource) {
    const word = source.readWhile(/[a-z\.0-9]/i)

    if (!word) {
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