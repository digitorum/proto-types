import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeValue } from './serialize-value'
import { Token } from '../../parser/enum/token'
export class SerializeVariableAssign extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public toString() {
    const name = this.find(Token.VariableName)
    const type = this.find(Token.VariableType)
    const repeated = this.find(Token.VariableRepeated)
    const value = this.findFirstOf([Token.Number, Token.DoubleQuotedString])

    if (!name) {
      throw new NoTokenFound()
    }

    let result: string = this.applyMutationRule(MutatorType.VariableName, name.content)

    if (type) {
      result += `: ${this.applyMutationRule(MutatorType.VariableType, type.content)}`
    }

    if (repeated) {
      result += '[]'
    }

    if (value) {
      result += ' = ' + new SerializeValue([value]).toString()
    }

    return result
  }
}