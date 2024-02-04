import { DataSource } from '../../data-source/data-source'
import { Tokenize } from './tokenize'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeVariableType } from './tokenize-variable-type'
import { TokenizeVariableAssing } from './tokenize-variable-assing'

export class TokenizeTypedVariableAssing extends Tokenize {
  public apply(source: DataSource) {
    return this.applyStack(source, [
      new TokenizeVariableType(),
      new TokenizeEmptyCharacters(),
      new TokenizeVariableAssing()
    ])
  }
}
