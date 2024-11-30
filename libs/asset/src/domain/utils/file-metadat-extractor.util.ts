import * as mime from 'mime-types'

export class FileMetadataExtractor {
  static extractMetadata(
    fileBuffer: Buffer,
    fileName: string,
  ): {
    mimeType: string
    fileSize: number
  } {
    const mimeType = mime.lookup(fileName) || 'application/octet-stream'

    return {
      mimeType: mimeType,
      fileSize: fileBuffer.length,
    }
  }
}
