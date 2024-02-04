import type { TokenData } from '../parser/tokenize/tokenize'

import { NoTokenFound } from './error/no-token-found'
import { Token } from '../parser/enum/token'

export class TokensDataStack {
  protected tokens: TokenData[]

  constructor(tokens: TokenData[] = []) {
    this.tokens = tokens
  }

  protected flatReadUntil(token: Token): TokenData[] {
    let result: TokenData[] = []
    let td: TokenData | undefined

    do {
      td = this.tokens.shift()

      if (!td) {
        throw new NoTokenFound()
      }

      result.push(td)

    } while(td.token !== token)

    return result
  }

  protected blockRead(open: Token, close: Token): TokenData[] {
    let result: TokenData[] = []
    let ticks: number = 0

    do {
      let td = this.tokens.shift()

      if (!td) {
        throw new NoTokenFound()
      }

      if (td.token === open) {
        ticks++
      }

      if (td.token === close) {
        ticks--
      }

      result.push(td)

    } while (ticks > 0)

    return result
  }

  protected find(token: Token): TokenData | null {
    const result = this.tokens.find((td) => td.token === token)

    if (!result) {
      return null
    }

    return result
  }

  protected findFirstOf(tokens: Token[]): TokenData | null {
    const result = this.tokens.find((td) => tokens.indexOf(td.token) !== -1)

    if (!result) {
      return null
    }

    return result
  }

}