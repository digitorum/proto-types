import type { TokenData } from '../../parser/tokenize/tokenize'

import { Token } from '../../parser/enum/token'

import { TokensDataStack } from '../tokens-data-stack'

export abstract class Serialize extends TokensDataStack {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public abstract toString(): string;
}