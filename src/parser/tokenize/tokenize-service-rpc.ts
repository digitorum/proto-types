import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'
import { Tokenize } from './tokenize'
import { TokenizeBlockEnd } from './tokenize-block-end'
import { TokenizeChar } from './tokenize-char'
import { TokenizeEmptyCharacters } from './tokenize-empty-characters'
import { TokenizeLiteral } from './tokenize-literal'
import { TokenizeRpcBody } from './tokenize-rpc-body'
import { TokenizeWord } from './tokenize-word'

export class TokenizeServiceRpc extends Tokenize {
  constructor() {
    super()
  }

  public apply(source: DataSource) {
    const result = this.applyStack(source, [
      new TokenizeWord(Token.RpcDefinitionStart),
      new TokenizeEmptyCharacters(),
      new TokenizeLiteral(Token.RpcName),
      new TokenizeEmptyCharacters(),
      new TokenizeChar('(', Token.OpenBracketSymbol),
      new TokenizeEmptyCharacters(),
      new TokenizeLiteral(Token.RpcInput),
      new TokenizeEmptyCharacters(),
      new TokenizeChar(')', Token.CloseBracketSymbol),
      new TokenizeEmptyCharacters(),
      new TokenizeWord(Token.RpcReturns, 'returns'),
      new TokenizeEmptyCharacters(),
      new TokenizeChar('(', Token.OpenBracketSymbol),
      new TokenizeEmptyCharacters(),
      new TokenizeLiteral(Token.RpcOutput),
      new TokenizeEmptyCharacters(),
      new TokenizeChar(')', Token.CloseBracketSymbol),
      new TokenizeEmptyCharacters(),
      new TokenizeChar('{', Token.RpcBodyStart),
      new TokenizeEmptyCharacters(),
      new TokenizeRpcBody(),
      new TokenizeEmptyCharacters(),
      new TokenizeBlockEnd(Token.RpcBodyEnd)
    ])

    result.push({
      token: Token.RpcDefinitionEnd,
      content: ''
    })

    return result
  }
}
