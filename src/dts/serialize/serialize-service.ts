import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { Serialize } from './serialize'
import { SerializeComment } from './serialize-comment'
import { SerializeServiceRpc } from './serialize-service-rpc'
import { Token } from '../../parser/enum/token'

export class SerializeService extends Serialize {
  constructor(context: SerializeContext) {
    super(context)
  }

  public toString(): string {
    let result: string[] = []
    let namespace: string = ''
    let tempComments: TokenData[] = []

    TICK: do {
      const td = this.tokens.shift()

      switch(td?.token) {

        case Token.ServiceName: {
          namespace = td.content
        }

        case Token.RpcDefinitionStart: {
          const rpc = this.instance(SerializeServiceRpc, [td].concat(this.flatReadUntil(Token.RpcDefinitionEnd)))
            .setComment(tempComments)
            .toString()

          tempComments = []

          result.push(rpc)
          result.push('\n')
          continue TICK
        }

        case Token.Comment:
        case Token.MultilineComment: {
          tempComments = [td]

          while(this.tokens[0].token === Token.Comment || this.tokens[0].token === Token.MultilineComment) {
            const chunk = this.tokens.shift()

            if (chunk) {
              tempComments.push(chunk)
            }
          }

          if (this.tokens[0].token !== Token.RpcDefinitionStart) {
            result.push(this.instance(SerializeComment, tempComments).toString())
            tempComments = []
          }
          continue TICK
        }

      }

    } while (this.tokens.length)

    return `

      export namespace ${namespace} {
        ${result.join('\n')}
      }

    `
  }

}
