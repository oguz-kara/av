export class DomainException extends Error {
  constructor(
    readonly message: string,
    readonly code: string,
  ) {
    super(message)
    this.name = this.constructor.name
  }

  getErrorCode(): string {
    return this.code
  }
}
