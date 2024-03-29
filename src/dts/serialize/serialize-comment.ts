import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeComment extends Serialize {
  constructor(context: SerializeContext) {
    super(context)
  }

  public toString() {
    return this.tokens
      .map((td) => {
        if (td.token === Token.Comment) {
          return `// ${td.content}`
        }

        if (td.token === Token.MultilineComment) {
          return `/** ${td.content} */`
        }

        return ''
      })
      .join('\n')
  }
}
