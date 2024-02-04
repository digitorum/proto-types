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
import { Token } from '../parser/enum/token'
import { TokensDataStack } from './tokens-data-stack'

export class DtsFile extends TokensDataStack {

  private basePath: string

  private namespace: string
  private imports: string[]
  private source: string

  constructor({
    basePath = './',
    dataSource
  }: {
    basePath?: string;
    dataSource: DataSource;
  }) {
    super()

    this.basePath = basePath

    this.imports = []
    this.source = ''
    this.namespace = ''

    this.tokens = new Lexer(dataSource).parse()

    this.perform()
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

  public async write(filePath: string) {
    fs.writeFileSync(path.resolve(this.basePath, filePath), await this.formatted)
  }

  public perform() {
    TICK: while(this.tokens.length) {
      switch(this.tokens[0].token) {

        case Token.VariableName: {
          this.source += new SerializeGlobalVar(this.flatReadUntil(Token.SemicolonSymbol)).toString()
          this.source += '\n'
          continue TICK
        }
  
        case Token.Package: {
          const pckg = new SerializePackage(this.flatReadUntil(Token.SemicolonSymbol))

          this.namespace = pckg.namespace

          this.source += pckg.toString()
          this.source += '\n'
          continue TICK
        }

        case Token.VariableTypeDefinitionStart: {
          this.source += new SerializeGlobalVar(this.flatReadUntil(Token.SemicolonSymbol)).toString()
          this.source += '\n'
          continue TICK
        }

        case Token.Import: {
          const imprt = new SerializeImport(this.flatReadUntil(Token.SemicolonSymbol))

          const dtsFile = new DtsFile({
            basePath: this.basePath,
            dataSource: new DataSourceFile(imprt.path)
          })

          dtsFile.write(imprt.dTsPath)

          this.imports.push(imprt.toImportString([dtsFile.ns]))

          continue TICK
        }

        case Token.Comment: {
          this.source += new SerializeComment(this.flatReadUntil(Token.Comment)).toString()
          this.source += '\n'
          continue TICK
        }

        case Token.MultilineComment: {
          this.source += new SerializeComment(this.flatReadUntil(Token.MultilineComment)).toString()
          this.source += '\n'
          continue TICK
        }

        case Token.MessageStart: {
          const message = new SerializeMessage(this.blockRead(Token.MessageStart, Token.MessageBodyEnd))

          this.source += message.toString()
          this.source += '\n'
          continue TICK
        }

        case Token.Enum: {
          this.source += new SerializeEnum(this.blockRead(Token.Enum, Token.EnumBodyEnd)).toString()
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

    export namespace ${this.namespace} { ${this.source} }

    `
  }

}
