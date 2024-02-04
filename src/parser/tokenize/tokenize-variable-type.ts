import type { TokenData } from './tokenize'

import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeChar } from './tokenize-char'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeLiteral } from './tokenize-literal'

export class TokenizeVariableType extends Tokenize {
  public apply(source: DataSource) {
    let result: TokenData[] = []

    const word = source.readWhile(/[a-z\.0-9]/i)

    if (word === 'map') {
      result = result.concat(
        [
          {
            token: Token.VariableTypeMap,
            content: word
          }
        ],
        this.applyStack(source, [
          new TokenizeEmptyCharacters(),
          new TokenizeChar('<', Token.LtSymbol),
          new TokenizeEmptyCharacters(),
          new TokenizeLiteral(Token.VariableTypeMapKey),
          new TokenizeEmptyCharacters(),
          new TokenizeChar(',', Token.CommaSymbol),
          new TokenizeEmptyCharacters(),
          new TokenizeLiteral(Token.VariableTypeMapValue),
          new TokenizeEmptyCharacters(),
          new TokenizeChar('>', Token.GtSymbol)
        ])
      )
    } else {
      result.push({
        token: Token.VariableType,
        content: word
      })
    }

    if (result.length) {
      // Определяем границы определения типа
      result.unshift({
        token: Token.VariableTypeDefinitionStart,
        content: ''
      })

      result.push({
        token: Token.VariableTypeDefinitionEnd,
        content: ''
      })
    }

    return result
  }
}
