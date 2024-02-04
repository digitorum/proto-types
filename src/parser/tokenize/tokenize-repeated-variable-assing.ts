import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeLiteral } from './tokenize-literal'
import { TokenizeTypedVariableAssing } from './tokenize-typed-variable-assing'

export class TokenizeRepeatedVariableAssing extends Tokenize {
  public apply(source: DataSource) {
    return this.applyStack(source, [
      new TokenizeLiteral(Token.VariableRepeated),
      new TokenizeEmptyCharacters(),
      new TokenizeTypedVariableAssing()
    ])
  }
}
