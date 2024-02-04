import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeChar } from './tokenize-char'
import { TokenizeComment } from './tokenize-comment'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeLiteral } from './tokenize-literal'
import { TokenizeWord } from './tokenize-word'
import { TokenizeVariableAssing } from './tokenize-variable-assing'

export class TokenizeEnum extends Tokenize {
  public apply(source: DataSource) {
    let result = this.applyStack(source, [
      new TokenizeLiteral(Token.Enum),
      new TokenizeEmptyCharacters(),
      new TokenizeWord(Token.EnumName),
      new TokenizeEmptyCharacters(),
      new TokenizeChar('{', Token.EnumBodyStart)
    ])

    TICK: while(1) {

      new TokenizeEmptyCharacters().apply(source)

      if (source.nextChars(2) === '//') {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      if (source.nextChars(3) === '/**') {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      if (source.nextChar === '}') {
        return result.concat(new TokenizeChar('}', Token.EnumBodyEnd).apply(source))
      }

      result = result.concat(new TokenizeVariableAssing().apply(source))
    }

    return []
  }
}