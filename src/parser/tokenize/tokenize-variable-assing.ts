import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeChar } from './tokenize-char'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeVariableValue } from './tokenize-variable-value'
import { TokenizeWord } from './tokenize-word'

export class TokenizeVariableAssing extends Tokenize {
  public apply(source: DataSource) {
    return this.applyStack(source, [
      new TokenizeWord(Token.VariableName),
      new TokenizeEmptyCharacters(),
      new TokenizeChar('=', Token.EqualSymbol),
      new TokenizeEmptyCharacters(),
      new TokenizeVariableValue(),
      new TokenizeEmptyCharacters(),
      new TokenizeChar(';', Token.SemicolonSymbol),
      new TokenizeEmptyCharacters()
    ])
  }
}
