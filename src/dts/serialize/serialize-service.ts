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

    TICK: do {
      const td = this.tokens.shift()

      switch(td?.token) {

        case Token.ServiceName: {
          namespace = td.content
        }

        case Token.RpcDefinitionStart: {
          result.push(
            this.instance(SerializeServiceRpc, [td].concat(this.flatReadUntil(Token.RpcDefinitionEnd))).toString()
          )
          continue TICK
        }

        case Token.Comment:
        case Token.MultilineComment: {
          result.push(this.instance(SerializeComment, [td]).toString())
          continue TICK
        }

      }

    } while (this.tokens.length)

    return `

      export namespace ${namespace} {
        ${result.join('\n\n')}
      }

    `
  }

}
