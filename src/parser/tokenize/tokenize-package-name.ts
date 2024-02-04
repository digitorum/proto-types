import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeChar } from './tokenize-char'
import { TokenizeLiteral } from './tokenize-literal'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeWord } from './tokenize-word'

export class TokenizePackageName extends Tokenize {
  public apply(source: DataSource) {
    return this.applyStack(source, [
      new TokenizeWord(Token.Package),
      new TokenizeEmptyCharacters(),
      new TokenizeLiteral(Token.PackageName),
      new TokenizeChar(';', Token.SemicolonSymbol)
    ])
  }
}
