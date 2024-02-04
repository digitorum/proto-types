import { DataSource } from '../../data-source/data-source'
import { Token } from '../enum/token'

export type TokenData = {
  token: Token;
  content: string;
}

export abstract class Tokenize {
  public abstract apply(source: DataSource): TokenData[];

  protected applyStack(source: DataSource, stack: Tokenize[]) {
    let result: TokenData[] = []

    try {
      stack.forEach((instance) => {
        result = result.concat(instance.apply(source))
      })

      return result
    } catch (e) {
      throw e
    }
  }
}