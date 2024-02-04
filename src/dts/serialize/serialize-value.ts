import type { TokenData } from '../../parser/tokenize/tokenize'

import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeValue extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    return this.tokens
      .map((tokenData) => {
        switch(tokenData.token) {
          case Token.Number: {
            return tokenData.content
          }
          case Token.DoubleQuotedString: {
            return `"${tokenData.content}"`
          }
        }

        return ''
      })
      .join('')
  }
}
