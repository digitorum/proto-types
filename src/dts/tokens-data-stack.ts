import type { TokenData } from '../parser/tokenize/tokenize'

import { NoTokenFound } from './error/no-token-found'
import { Token } from '../parser/enum/token'

export class TokensDataStack {
  protected tokens: TokenData[]

  constructor() {
    this.tokens = []
  }

  public setTokens(tokens: TokenData[]) {
    this.tokens = tokens

    return this
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

  protected findInnerBlock(open: Token, close: Token) {
    let startIndex = 0
    let counter = 0

    for(let i = 0; i < this.tokens.length; ++i) {
      const td = this.tokens[i]

      if (td.token === open && i !== 0) {
        if (!startIndex) {
          startIndex = i
        }

        counter++
      }

      if (td.token === close) {
        if (counter === 0) {
          return null // такое может быть если закрыто неоткрытое.
        }

        counter--

        if (counter === 0) {
          return this.tokens.splice(startIndex, i - startIndex + 1)
        }
      }
    }

    return null
  }

  protected flatFindBlock(open: Token, close: Token): TokenData[] | null {
    const startIndex = this.tokens.findIndex((td) => td.token === open)
    const endIndex = this.tokens.findIndex((td) => td.token === close)

    if (startIndex === -1 || endIndex === -1) {
      return null
    }

    return this.tokens.slice(startIndex, endIndex + 1)
  }

  protected findFirstOf(tokens: Token[]): TokenData | null {
    const result = this.tokens.find((td) => tokens.indexOf(td.token) !== -1)

    if (!result) {
      return null
    }

    return result
  }

}