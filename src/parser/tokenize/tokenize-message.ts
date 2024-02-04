import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeChar } from './tokenize-char'
import { TokenizeMessageBody } from './tokenize-message-body'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
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
      new TokenizeChar('}', Token.MessageBodyEnd)
    ])
  }
}