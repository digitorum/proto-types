import type { TokenData } from '../../parser/tokenize/tokenize'

import { MutatorType } from '../enum/mutator-type'
import { Serialize } from './serialize'
import { Token } from '../../parser/enum/token'

export class SerializeImport extends Serialize {
  constructor(tokens: TokenData[]) {
    super(tokens)
  }

  public get path(): string {
    return this.find(Token.DoubleQuotedString)?.content ?? ''
  }

  public get dTsPath(): string | null {

    // Игнорируем все внутренние типы протобафа
    if (this.path.match(/^google\/protobuf/)) {
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
