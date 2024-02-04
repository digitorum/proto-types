export class NoTokenFound extends Error {
  constructor() {
    super()

    this.message = 'No token found'
  }
}
