import type { TokenData } from './tokenize'

import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeChar } from './tokenize-char'
import { TokenizeComment } from './tokenize-comment'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeTypedVariableAssing } from './tokenize-typed-variable-assing'
import { TokenizeWord } from './tokenize-word'


export class TokenizeMessageBodyOneOf extends Tokenize{
  public apply(source: DataSource) {
    let result: TokenData[] = this.applyStack(source, [
      new TokenizeWord(Token.MessageOneOfStart),
      new TokenizeEmptyCharacters(),
      new TokenizeWord(Token.MessageOneOfParameterName),
      new TokenizeEmptyCharacters(),
      new TokenizeChar('{', Token.MessageOneOfBodyStart)
    ])

    TICK: while(1) {

      new TokenizeEmptyCharacters().apply(source)

      if(source.nextChar === '}') {
        return result.concat(
          new TokenizeChar('}', Token.MessageOneOfBodyEnd).apply(source)
        )
      }

      if (source.nextChars(2) === '//') {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      if (source.nextChars(3) === '/**') {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      if(source.nextChar !== '}') {
        result = result.concat(new TokenizeTypedVariableAssing().apply(source))
        continue TICK
      }
    }

    return []
  }
}
