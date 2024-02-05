import { ReadableStreamDefaultReader } from 'stream/web'
import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeBlockEnd } from './tokenize-block-end'
import { TokenizeChar } from './tokenize-char'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeServiceBody } from './tokenize-service-body'
import { TokenizeWord } from './tokenize-word'

export class TokenizeService extends Tokenize {
  constructor() {
    super()
  }

  public apply(source: DataSource) {
    const result = this.applyStack(source, [
      new TokenizeWord(Token.ServiceDefinitionStart),
      new TokenizeEmptyCharacters(),
      new TokenizeWord(Token.ServiceName),
      new TokenizeEmptyCharacters(),
      new TokenizeChar('{', Token.ServiceBodyStart),
      new TokenizeEmptyCharacters(),
      new TokenizeServiceBody(),
      new TokenizeBlockEnd(Token.ServiceBodyEnd)
    ])
    
    result.push({
      token: Token.ServiceDefinitionEnd,
      content: ''
    })

    return result
  }

}
