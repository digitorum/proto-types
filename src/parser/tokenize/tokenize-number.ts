import { DataSource } from '../../data-source/data-source'
import { SyntaxError } from '../error/syntax-error'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'

export class TokenizeNumber extends Tokenize {
  public apply(source: DataSource) {
    const number = source.readWhile(/[0-9]/)

    if (!number) {
      throw new SyntaxError() 
    }

    return [
      {
        token: Token.Number,
        content: number
      }
    ]
  }
}