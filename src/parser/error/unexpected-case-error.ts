export class UnexpectedCaseError extends Error {
  constructor() {
    super()

    this.message = 'Parser unexpected case'
  }
}