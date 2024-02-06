import { DataSource } from '../../data-source/data-source'
import { Tokenize } from './tokenize'
import { TokenizeComment } from './tokenize-comment'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeEnum } from './tokenize-enum'
import { TokenizeMessage } from './tokenize-message' // circular?
import { TokenizeMessageBodyOneOf } from './tokenize-message-body-one-of'
import { TokenizeRepeatedVariableAssing } from './tokenize-repeated-variable-assing'
import { TokenizeTypedVariableAssing } from './tokenize-typed-variable-assing'

export class TokenizeMessageBody extends Tokenize {
  public apply(source: DataSource) {
    let result: any[] = []

    TICK: while(1) {

      new TokenizeEmptyCharacters().apply(source)

      if(source.nextChar === '}') {
        // Сообщение завершено
        return result
      }

      if (source.nextChars(2) === '//') {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      if (source.nextChars(3) === '/**') {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      if (source.nextChars(7) === 'message') {
        result = result.concat(new TokenizeMessage().apply(source))
        continue TICK
      }

      if (source.nextChars(5) === 'oneof') {
        result = result.concat(new TokenizeMessageBodyOneOf().apply(source))
        continue TICK
      }

      if (source.nextChars(8) === 'repeated') {
        result = result.concat(new TokenizeRepeatedVariableAssing().apply(source))
        continue TICK
      }

      if (source.nextChars(4) === 'enum') {
        result = result.concat(new TokenizeEnum().apply(source))
        continue TICK
      }

      if(source.nextChar !== '}') {
        result = result.concat(new TokenizeTypedVariableAssing().apply(source))
        continue TICK
      }
    }

    return result
  }
}
