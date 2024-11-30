export interface ChannelData {
  token: string
  code: string
  defaultLanguageCode: string
  currencyCode: string
}

export interface ChannelContextInterface {
  findChannelByToken(token: string): Promise<ChannelData | null>
  createDefaultChannel(): Promise<ChannelData>
}
