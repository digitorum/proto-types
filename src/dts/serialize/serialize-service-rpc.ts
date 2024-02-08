import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeServiceRpc extends Serialize {
  private comments: TokenData[]

  constructor(context: SerializeContext) {
    super(context)

    this.comments = []
  }

  public setTokens(tokens: TokenData[]) {
    Serialize.prototype.setTokens.call(this, tokens)
    
    this.name = this.find(Token.RpcName)?.content ?? ''

    return this
  }

  public setComment(comments: TokenData[]) {
    this.comments = comments

    return this
  }

  public get argType() {
    return this.applyMutationRule(MutatorType.VariableType, this.find(Token.RpcInput)?.content ?? '')
  }

  public get returnType() {
    return this.applyMutationRule(MutatorType.VariableType, this.find(Token.RpcOutput)?.content ?? '')
  }

  public get comment() {
    const rows = this.comments
      .map((token) => token.content)
      .concat(
        (this.find(Token.RpcBody)?.content ?? '').split('\n')
      )
      .filter((str) => !!str)
      .map((str) => ` * ${str}`)

    if (rows.length) {
      return `
      /**
       ${rows.join('\n')}
       */`
    }

    return ''
  }

  public toString() {
    return `${this.comment}
    export interface ${this.name} {
      (input: ${this.argType}):  Promise<${this.returnType}>;
    }`
  }
}
