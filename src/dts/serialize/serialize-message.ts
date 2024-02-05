import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { NoTokenFound } from '../error/no-token-found'
import { Serialize } from './serialize'
import { SerializeComment } from './serialize-comment'
import { SerializeVariableOptionalType } from './serialize-variable-optional-type'
import { SerializeVariableType } from './serialize-variable-type'
import { Token } from '../../parser/enum/token'

export class SerializeMessage extends Serialize {

  private parsed: {
    type: string;
    sourceName: string;
    resultName: string;
    scope: string[]
  }[]

  constructor(tokens: TokenData[], context: SerializeContext) {
    super(tokens, context)

    this.parsed = []

    this.fill()
  }

  public get messages() {
    return this.parsed.map((node) => node.resultName)
  }

  private setParsedChunk(
    type: string,
    sourceName: string,
    resultName: string,
    scope: string[]
  ) {
    this.parsed.push({
      type,
      sourceName,
      resultName,
      scope
    })
  }

  private findScopedTypeName(sourceName: string, scope: string[]) {
    return this.parsed
      .filter((node) => {
        // сразу отсекаем несовпадение по исходному типу
        if (node.sourceName !== sourceName) {
          return false
        }

        // нужно найти все совпадения по скопу
        // ткущий тип лжит глубже по вложенности
        if (node.scope.length < scope.length) {
          return false
        }

        // Если не все ноды скопа соедржатся в элементе - пропускаем
        if (scope.filter((ns) => node.scope.indexOf(ns) !== -1).length !== scope.length) {
          return false
        }

        return true
      })
      .sort((a, b) => a.scope.length - b.scope.length)[0]?.resultName ?? null
  }

  private fill(scope: string[] = []) {
    let result: string = ''
    let isMessaheStartMatched = false
    let isOneOfBlockStarted = false
    let sourceInterfaceName = ''
    let resultIntarfaceName = ''

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
          if (isMessaheStartMatched) {
            // уводим на второй виток перед этим вернув токен на место.
            this.tokens.unshift(td)
            this.fill([...scope, sourceInterfaceName])
          } else {
            isMessaheStartMatched = true
            result += 'export interface '
          }
          break
        }

        case Token.MessageName: {
          sourceInterfaceName = td.content
          resultIntarfaceName = [...scope, td.content].join('__')
          result += resultIntarfaceName
          break
        }

        case Token.MessageBodyStart: {
          result += ' {\n'
          break
        }

        case Token.VariableTypeDefinitionStart:
        case Token.VariableRepeated: {

          const tokens = [td]
            .concat(this.flatReadUntil(Token.SemicolonSymbol))
            .map((tokenData) => {

              if (tokenData.token === Token.VariableType) {
                let typename = this.findScopedTypeName(tokenData.content, scope)

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
            typeDefinition = this.instance(SerializeVariableOptionalType, tokens)
          } else {
            typeDefinition = this.instance(SerializeVariableType, tokens)
          }

          result += `${typeDefinition.toString()};\n`
          break;
        }

        case Token.MessageBodyEnd: {
          result += '}\n'
          // Сборка завершена
          return this.setParsedChunk(
            result,
            sourceInterfaceName,
            resultIntarfaceName,
            scope
          )
        }
      }
    } while (this.tokens.length > 0)
  }

  public toString() {
    return this.parsed
      .map((chunk) => chunk.type).join('\n')
  }
}
