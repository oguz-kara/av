export class ExceedingMaxLimitError extends Error {
  public code = 'EXCEEDING_MAX_LIMIT'

  constructor(
    msg: string = 'Exceeding max limit',
    code: string = 'EXCEEDING_MAX_LIMIT',
  ) {
    super(msg)
    this.code = code
  }
}
