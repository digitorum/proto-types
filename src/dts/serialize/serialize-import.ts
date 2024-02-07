import type { SerializeContext } from './serialize'
import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeImport extends Serialize {
  private path: string

  constructor(context: SerializeContext) {
    super(context)

    this.path = ''
  }

  public setTokens(tokens: TokenData[]) {
    Serialize.prototype.setTokens.call(this, tokens)

    this.path = this.find(Token.DoubleQuotedString)?.content ?? ''

    return this
  }

  public get dTsPath(): string | null {

    // Игнорируем все внутренние типы протобафа
    if (this.path.match(/^google\/(protobuf|api)/)) {
      return null
    }

    return this.applyMutationRule(MutatorType.ImportFilePath, this.path)
  }

  public toString() {
    return `// ${this.find(Token.Import)?.content} "${this.path}"`
  }

  public toImportString(args: string[]) {
    return `import { ${args.join(', ')} } from './${this.dTsPath}'`
  }
}
