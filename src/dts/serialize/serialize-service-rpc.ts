import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeServiceRpc extends Serialize {
  constructor(tokens: TokenData[], context: SerializeContext) {
    super(tokens, context)
  }

  public get name() {
    return this.find(Token.RpcName)?.content ?? ''
  }

  public get argType() {
    return this.applyMutationRule(MutatorType.VariableType, this.find(Token.RpcInput)?.content ?? '')
  }

  public get returnType() {
    return  this.applyMutationRule(MutatorType.VariableType, this.find(Token.RpcOutput)?.content ?? '')
  }

  public toString() {
    return `export interface ${this.name} {

      (input: ${this.argType}):  Promise<${this.returnType}>;

    }`
  }
}
