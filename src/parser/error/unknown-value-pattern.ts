export class UnknownValuePattern extends Error {
  constructor(message: string = 'Unknown value pattern') {
    super()

    this.message = message
  }
}
