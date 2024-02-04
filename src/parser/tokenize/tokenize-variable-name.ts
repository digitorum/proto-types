import type { TokenData } from './tokenize'

import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { SyntaxError } from '../error/syntax-error'

export class TokenizeVariableName extends Tokenize {
  public apply(source: DataSource): TokenData[] {
    const word = source.readWhile(/[a-z_0-9]/i)

    if (!word) {
      throw new SyntaxError()
    }

    return [
      {
        token: Token.VariableName,
        content: word
      }
    ]
  }
}
