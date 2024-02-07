import { DataSource } from '../../data-source/data-source'
import { Tokenize } from './tokenize'
import { TokenizeDoubleQuotedString } from './tokenize-double-quoted-string'
import { TokenizeNumber } from './tokenize-number'
import { UnknownValuePattern } from '../error/unknown-value-pattern'

export class TokenizeVariableValue extends Tokenize {
  public apply(source: DataSource) {

    if (source.nextChar === '"') {
      return new TokenizeDoubleQuotedString().apply(source)
    }

    if (source.isNextCharNumeric) {
      return new TokenizeNumber().apply(source)
    }

    throw new UnknownValuePattern()
  }
}
