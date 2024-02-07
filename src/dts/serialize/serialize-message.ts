import type { SerializeConstructor, SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeComment } from './serialize-comment'
import { SerializeEnum } from './serialize-enum'
import { SerializeVariableDefinitionOptional } from './serialize-variable-definition-optional'
import { SerializeVariableDefinition } from './serialize-variable-definition'
import { Token } from '../../parser/enum/token'

type EntityInScope = typeof SerializeMessage
  | typeof SerializeEnum

export class SerializeMessage extends Serialize {
  public name: string = ''

  constructor(context: SerializeContext) {
    super(context)

    this.name = ''
  }

  public setTokens(tokens: TokenData[]) {
    Serialize.prototype.setTokens.call(this, tokens)

    this.name = this.find(Token.MessageName)?.content ?? ''

    // найти все вложенные структуры (message и enum - именно в таком порядке)
    // подготовить классы для сериализации без вызова оной
    // сформировать ScopedTypeName
    // сериализовать с применением ScopedTypeName

    const stack: [EntityInScope, Token, Token][] = [
      [SerializeMessage, Token.MessageStart, Token.MessageBodyEnd],
      [SerializeEnum, Token.Enum, Token.EnumBodyEnd]
    ]

    stack
      .forEach(([ctor, open, close]) => {
        let innerEntity = null

        do {
          innerEntity = this.findInnerBlock(open, close)

          if (innerEntity) {
            this.addToScope(this.instance(ctor, innerEntity))
          }

        } while (innerEntity !== null)
      })

    return this
  }

  public toString() {
    let result: string = ''
    let isOneOfBlockStarted = false

    result += this.applyToScope((node) => node.toString()).join('\n')

    do {
      const td = this.tokens.shift()

      if (!td) {
        throw new NoTokenFound()
      }

      switch(td.token) {
        case Token.MessageOneOfBodyStart: {
          isOneOfBlockStarted = true
          break
        }

        case Token.MessageOneOfBodyEnd: {
          isOneOfBlockStarted = false
          break
        }

        case Token.Comment:
        case Token.MultilineComment: {
          result += `${this.instance(SerializeComment, [td]).toString()}\n`
          break
        }

        case Token.MessageStart: {
          result += 'export interface '
          break
        }

        case Token.MessageName: {
          result += this.scopedName
          break
        }

        case Token.MessageBodyStart: {
          result += ' {\n'
          break
        }

        case Token.MessageBodyEnd: {
          result += '}\n'
          break
        }

        case Token.VariableTypeDefinitionStart:
        case Token.VariableRepeated: {

          const tokens = [td]
            .concat(this.flatReadUntil(Token.SemicolonSymbol))
            .map((tokenData) => {
              if (tokenData.token === Token.VariableType || tokenData.token === Token.VariableTypeMapValue) {
                let typename = this.findNameInScope(tokenData.content)

                if (typename) {
                  return {
                    token: tokenData.token,
                    content: typename
                  }
                }
              }

              return tokenData
            })

          let typeDefinition: Serialize

          if (isOneOfBlockStarted) {
            typeDefinition = this.instance(SerializeVariableDefinitionOptional, tokens)
          } else {
            typeDefinition = this.instance(SerializeVariableDefinition, tokens)
          }

          result += `${typeDefinition.toString()};\n`
          break;
        }
      }
    } while (this.tokens.length > 0)

    return result
  }
}
