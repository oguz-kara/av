import { RequestContext } from '@av/common'
import { Asset } from '@av/database'

export class FileProcessingContext {
  fileBuffer: Buffer
  originalFilename: string
  normalizedFilename?: string
  metadata?: Partial<Asset>
  asset?: Asset

  constructor(fileBuffer: Buffer, originalFilename: string) {
    this.fileBuffer = fileBuffer
    this.originalFilename = originalFilename
  }

  static create(fileBuffer: Buffer, originalFilename: string) {
    return new FileProcessingContext(fileBuffer, originalFilename)
  }

  getAsset(ctx: RequestContext) {
    return {
      name: this.normalizedFilename,
      originalName: this.originalFilename,
      mimeType: this.metadata?.mimeType,
      fileSize: this.metadata?.fileSize || 0,
      width: this.metadata?.width || 0,
      height: this.metadata?.height || 0,
      type: this.metadata?.type,
      source: this.metadata?.source || '',
      channelToken: ctx.channel.token,
    }
  }
}
