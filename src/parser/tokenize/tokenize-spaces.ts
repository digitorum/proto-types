import { DataSource } from '../../data-source/data-source'
import { Tokenize } from './tokenize'

export class TokenizeSpaces extends Tokenize {
  public apply(source: DataSource) {
    source.readSpaces()
    return []
  }
}
