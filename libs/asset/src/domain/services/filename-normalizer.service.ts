import { Injectable } from '@nestjs/common'
import * as path from 'path'
import { IFilenameNormalizer } from './filename-normalizer.interface'
import { ConfigService } from '@nestjs/config'
import slugify from 'slugify'

@Injectable()
export class FilenameNormalizer implements IFilenameNormalizer {
  constructor(private readonly configService: ConfigService) {}

  normalize(originalName: string, fileType: string): string {
    if (!originalName) {
      throw new Error('Original name must be provided')
    }

    const configExt = this.configService.get<string>('asset.imageExtension')
    const timestamp = Date.now()
    const originalExtension = path.extname(originalName) || ''
    const baseName = path.basename(originalName, originalExtension)

    if (!baseName) {
      throw new Error('Invalid file name')
    }

    const slugifiedBaseName = slugify(baseName, {
      replacement: '_',
      trim: true,
    })

    const ext =
      fileType !== 'IMAGE'
        ? originalExtension
        : configExt
          ? configExt.startsWith('.')
            ? configExt
            : `.${configExt}`
          : originalExtension

    return `${slugifiedBaseName}-${timestamp}${ext}`.toLowerCase()
  }
}
