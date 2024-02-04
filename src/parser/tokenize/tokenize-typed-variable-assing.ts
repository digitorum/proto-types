import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeLiteral } from './tokenize-literal'
import { TokenizeVariableAssing } from './tokenize-variable-assing'

export class TokenizeTypedVariableAssing extends Tokenize {
  public apply(source: DataSource) {
    return this.applyStack(source, [
      new TokenizeLiteral(Token.VariableType),
      new TokenizeEmptyCharacters(),
      new TokenizeVariableAssing()
    ])
  }
}
