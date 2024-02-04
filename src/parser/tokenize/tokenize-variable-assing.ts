import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeChar } from './tokenize-char'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeVariableName } from './tokenize-variable-name'
import { TokenizeVariableValue } from './tokenize-variable-value'

export class TokenizeVariableAssing extends Tokenize {
  public apply(source: DataSource) {
    return this.applyStack(source, [
      new TokenizeVariableName(),
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
