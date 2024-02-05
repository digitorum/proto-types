export class SyntaxError extends Error {
  constructor(message: string = 'Syntax error') {
    super()

    this.message = message
  }
}
