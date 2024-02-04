import { DataSource } from '../../data-source/data-source'
import { Tokenize } from './tokenize'

export class TokenizeEmptyCharacters extends Tokenize {
  public apply(source: DataSource) {
    source.readEmptyCharacters()
    return []
  }
}
