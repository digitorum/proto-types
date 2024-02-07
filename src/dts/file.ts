import type { SerializeContext, SerializeConstructor } from './serialize/serialize'
import type { TokenData } from '../parser/tokenize/tokenize'

import * as prettier from "prettier"
import fs from 'node:fs'
import path from 'node:path'

import { DataSource } from '../data-source/data-source'
import { DataSourceFile } from '../data-source/data-source-file'
import { Lexer } from '../parser/lexer'
import { SerializeComment } from './serialize/serialize-comment'
import { SerializeEnum } from './serialize/serialize-enum'
import { SerializeGlobalVar } from './serialize/serialize-global-var'
import { SerializeImport } from './serialize/serialize-import'
import { SerializeMessage } from './serialize/serialize-message'
import { SerializePackage } from './serialize/serialize-package'
import { SerializeService } from './serialize/serialize-service'
import { Token } from '../parser/enum/token'
import { TokensDataStack } from './tokens-data-stack'

export class DtsFile extends TokensDataStack {

  private basePath: string

  private namespace: string
  private package: string;
  private imports: string[]
  private source: string

  constructor({
    basePath = './',
  }: {
    basePath?: string;
  }) {
    super()

    this.basePath = basePath

    this.imports = []
    this.source = ''
    this.namespace = ''
    this.package = ''
  }

  private get context(): SerializeContext {
    return {
      namespace: this.namespace,
      package: this.package
    }
  }

  private get formatted(): Promise<string> {
    return prettier.format(this.source, {
      "trailingComma": "none",
      "singleQuote": true,
      "parser": "typescript"
    })
  }

  public get ns(): string {
    return this.namespace
  }

  public setDataSource(src: DataSource) {
    const tokens = new Lexer(src).parse()

    this.setTokens(tokens)
    this.perform()

    return this
  }

  public async write(file: string) {
    fs.writeFileSync(path.resolve(this.basePath, file), await this.formatted)
  }

  private getSerializerInstance<T extends SerializeConstructor>(
    ctor: T,
    tokens: TokenData[]
  ) {
    return (new ctor(this.context) as InstanceType<T>)
      .setTokens(tokens)
  }

  public perform() {
    TICK: while(this.tokens.length) {
      switch(this.tokens[0].token) {

        case Token.VariableName: {
          this.source += this.getSerializerInstance(SerializeGlobalVar, this.flatReadUntil(Token.SemicolonSymbol)).toString()
          this.source += '\n'
          continue TICK
        }
  
        case Token.Package: {
          const pckg = this.getSerializerInstance(SerializePackage, this.flatReadUntil(Token.SemicolonSymbol))

          this.namespace = pckg.namespace
          this.package = pckg.name

          this.source += pckg.toString()
          this.source += '\n'
          continue TICK
        }

        case Token.VariableTypeDefinitionStart: {
          this.source += this.getSerializerInstance(SerializeGlobalVar, this.flatReadUntil(Token.SemicolonSymbol)).toString()
          this.source += '\n'
          continue TICK
        }

        case Token.Import: {
          const imprt = this.getSerializerInstance(SerializeImport, this.flatReadUntil(Token.SemicolonSymbol))

          if (imprt.dTsPath) {
            new DtsFile({
              basePath: this.basePath
            })
            .setDataSource(new DataSourceFile(imprt.path))
            .write(imprt.dTsPath)

            // this.imports.push(imprt.toImportString([dtsFile.ns]))
          }

          continue TICK
        }

        case Token.Comment: {
          this.source += this.getSerializerInstance(SerializeComment, this.flatReadUntil(Token.Comment)).toString()
          this.source += '\n'
          continue TICK
        }

        case Token.MultilineComment: {
          this.source += this.getSerializerInstance(SerializeComment, this.flatReadUntil(Token.MultilineComment)).toString()
          this.source += '\n'
          continue TICK
        }

        case Token.MessageStart: {
          const message = this.getSerializerInstance(SerializeMessage, this.blockRead(Token.MessageStart, Token.MessageBodyEnd))

          this.source += message.toString()
          this.source += '\n'
          continue TICK
        }

        case Token.Enum: {
          this.source += this.getSerializerInstance(SerializeEnum, this.blockRead(Token.Enum, Token.EnumBodyEnd)).toString()
          this.source += '\n'
          continue TICK
        }

        case Token.ServiceDefinitionStart: {
          this.source += this.getSerializerInstance(SerializeService, this.flatReadUntil(Token.ServiceDefinitionEnd)).toString()
          this.source += '\n'
          continue TICK
        }

        default: {
          throw this.tokens[0].token
        }
      }
    }

    const importsTmpl = this.imports
      .join('\n')

    this.source = `

    ${importsTmpl}

    namespace ${this.namespace} { ${this.source} }

    `
  }

}
