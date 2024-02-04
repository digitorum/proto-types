export class UnexpectedCaseError extends Error {
  constructor() {
    super()

    this.message = 'Unexpected case'
  }
}