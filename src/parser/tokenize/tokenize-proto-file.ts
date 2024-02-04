import type { TokenData } from './tokenize'

import { DataSource } from '../../data-source/data-source'
import { Tokenize } from './tokenize'
import { TokenizeComment } from './tokenize-comment'
import { TokenizeEnum } from './tokenize-enum'
import { TokenizeImport } from './tokenize-import'
import { TokenizeMessage } from './tokenize-message'
import { TokenizePackageName } from './tokenize-package-name'
import { TokenizeTypedVariableAssing } from './tokenize-typed-variable-assing'
import { TokenizeVariableAssing } from './tokenize-variable-assing'
import { UnexpectedCaseError } from '../error/unexpected-case-error'

export class TokenizeProtoFile extends Tokenize {
  public apply(source: DataSource) {
    let result: TokenData[] = []

    TICK: while(1) {

      // на каждый тик удаляем лишние пустые символы
      source.readEmptyCharacters()

      if (source.oef) {
        return result
      }

      if (source.nextChars(2) === "//") {
        result = result.concat(new TokenizeComment().apply(source))
        continue TICK
      }

      if (source.nextChars(6) === "syntax") {
        result = result.concat(new TokenizeVariableAssing().apply(source))
        continue TICK
      }

      if (source.nextChars(6) === "option") {
        result = result.concat(new TokenizeTypedVariableAssing().apply(source))
        continue TICK
      }

      if (source.nextChars(7) === 'package') {
        result = result.concat(new TokenizePackageName().apply(source))
        continue TICK
      }

      if (source.nextChars(6) === 'import') {
        result = result.concat(new TokenizeImport().apply(source))
        continue TICK
      }

      if (source.nextChars(7) === 'message') {
        result = result.concat(new TokenizeMessage().apply(source))
        continue TICK
      }

      if (source.nextChars(4) === 'enum') {
        result = result.concat(new TokenizeEnum().apply(source))
        continue TICK
      }

      throw new UnexpectedCaseError()
    }

    return []
  }
}
