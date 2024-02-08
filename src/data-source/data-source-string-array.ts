import { DataSource } from './data-source'

export class DataSourceStringArray extends DataSource {
  constructor(
    protected source: string[] = []
  ) {
    super()
  }

  public get oef(): boolean {
    return this.source.length === 0
  }

  public get nextChar(): string {
    return this.source[0]
  }

  public nextChars(count: number): string {
    return this.source.slice(0, count).join('')
  }

  public readChar(): string {
    return this.source.shift() ?? ''
  }

  public readChars(count: number): string {
    return this.source.splice(0, count).join('')
  }

  public readWhile(matches: string[] | RegExp): string {
    let result: string = ''

    if (Array.isArray(matches)) {
      while (this.source.length !== 0 && matches.indexOf(this.nextChar) !== -1) {
        result += this.source.shift() ?? ''
      }
    } else {
      while (this.source.length !== 0 && matches.test(this.nextChar)) {
        result += this.source.shift() ?? ''
      }
    }

    return result
  }

  public readWhileNot(matches: string[]): string {
    let result: string = ''

    while (this.source.length !== 0 && matches.indexOf(this.nextChar) === -1) {
      result += this.source.shift() ?? ''
    }

    return result
  }
}