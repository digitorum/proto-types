import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeChar } from './tokenize-char'
import { TokenizeDoubleQuotedString } from './tokenize-double-quoted-string'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeWord } from './tokenize-word'

export class TokenizeImport extends Tokenize {
  public apply(source: DataSource) {
    return this.applyStack(source, [
      new TokenizeWord(Token.Import),
      new TokenizeEmptyCharacters(),
      new TokenizeDoubleQuotedString(),
      new TokenizeEmptyCharacters(),
      new TokenizeChar(';', Token.SemicolonSymbol)
    ])
  }
}