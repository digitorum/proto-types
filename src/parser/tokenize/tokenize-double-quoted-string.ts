import { DataSource } from '../../data-source/data-source'
import { SyntaxError } from '../error/syntax-error'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'

export class TokenizeDoubleQuotedString extends Tokenize {
  public apply(source: DataSource) {
    if (source.readChar() !== '"') {
      throw new SyntaxError()
    }

    const content = source.readWhileNot(['"'])

    if (source.readChar() !== '"') {
      throw new SyntaxError()
    }

    return [
      {
        token: Token.DoubleQuotedString,
        content
      }
    ]
  }
}