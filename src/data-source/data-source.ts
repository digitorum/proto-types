const emptyCharacters = [
  ' ',
  '\n',
  '\r',
  '\t'
]

export abstract class DataSource {
  public abstract get nextChar(): string;
  public abstract get oef(): boolean;
  public abstract nextChars(count: number): string;
  public abstract readChar(): string;
  public abstract readWhile(matches: string[] | RegExp): string;
  public abstract readWhileNot(matches: string[]): string;

  public readWord(): string {
    return this.readWhileNot(emptyCharacters)
  }

  public readLine(): string {
    return this.readWhileNot(['\r', '\n'])
  }

  public readEmptyCharacters() {
    return this.readWhile(emptyCharacters)
  }

  public readSpaces() {
    return this.readWhile([' ', '\t'])
  }

  public get isNextCharEmpty(): boolean {
    return emptyCharacters.indexOf(this.nextChar) !== -1
  }

  public get isNextCharNumeric(): boolean {
    return /[0-9]/.test(this.nextChar)
  }
}
