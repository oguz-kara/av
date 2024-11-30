import { Injectable } from '@nestjs/common'
import { UnsupportedFileError } from '../errors/unsupported-file-error'
import { supportedTypes } from 'config/file-types.config'

@Injectable()
export class FileTypeService {
  constructor() {}

  async getFileTypeFromFile(file: Express.Multer.File) {
    const mime = file.mimetype

    if (mime) {
      for (const [type, mimes] of Object.entries(supportedTypes)) {
        if (mimes.includes(mime)) return type
      }
    }

    throw new UnsupportedFileError()
  }
}
