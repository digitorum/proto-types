import { TokenData } from './tokenize'
import { DataSource } from '../../data-source/data-source'
import { Tokenize } from './tokenize'
import { Token } from '../../parser/enum/token'

export class TokenizeBlockEnd extends Tokenize {
  constructor(
    private asToken: Token
  ) {
    super()
  }

  public apply(source: DataSource) {
    let result: TokenData[] = []

    if (source.nextChar === '}') {
      result.push({
        token: this.asToken,
        content: source.readChar()
      })
    }

    source.readEmptyCharacters()

    if (source.nextChar === ';') {
      source.readChar()
    }

    return result
  }
}
