import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeBlockEnd } from './tokenize-block-end'
import { TokenizeChar } from './tokenize-char'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeMessageBody } from './tokenize-message-body'
import { TokenizeWord } from './tokenize-word'

export class TokenizeMessage extends Tokenize {
  public apply(source: DataSource) {
    return this.applyStack(source, [
      new TokenizeWord(Token.MessageStart),
      new TokenizeEmptyCharacters(),
      new TokenizeWord(Token.MessageName),
      new TokenizeEmptyCharacters(),
      new TokenizeChar('{', Token.MessageBodyStart),
      new TokenizeEmptyCharacters(),
      new TokenizeMessageBody(),
      new TokenizeBlockEnd(Token.MessageBodyEnd)
    ])
  }
}