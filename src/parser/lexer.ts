import { DataSource } from '../data-source/data-source'
import { TokenizeProtoFile } from './tokenize/tokenize-proto-file'

export class Lexer {
  constructor(
    private source: DataSource
  ) { }

  public parse() {
    return new TokenizeProtoFile().apply(this.source)
  }

}