export class ChannelTokenNotFoundError extends Error {
  public code = 'CHANNEL_TOKEN_NOT_FOUND'

  constructor(
    msg: string = 'Channel token not found',
    code: string = 'CHANNEL_TOKEN_NOT_FOUND',
  ) {
    super(msg)
    this.code = code
  }
}
