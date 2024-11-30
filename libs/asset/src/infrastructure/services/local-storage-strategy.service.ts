import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs/promises'
import * as path from 'path'

import { Asset } from '@av/database'

import { StorageStrategy } from '../../domain/services/storage-strategy.interface'
import { ImageProcessor } from '../../domain/services/image-processor.service'
import { UnsupportedFileError } from '../../domain/errors/unsupported-file-error'
import { DefaultScreenSizeItem } from '../../domain/types/default-screen-size-item.type'
import { defaultScreenSizes } from 'config/default-screen-sizes.config'

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
  private basePath: string
  private localPath: string
  private variationSizes: Record<string, DefaultScreenSizeItem>

  constructor(
    private readonly configService: ConfigService,
    private readonly imageProcessor: ImageProcessor,
  ) {
    this.basePath = path.resolve(__dirname, 'assets', 'preview')
    this.localPath =
      this.configService.get<string>('asset.storage.localPath') || ''
    this.variationSizes = {
      ...defaultScreenSizes,
      ...this.configService.get<Record<string, DefaultScreenSizeItem>>(
        'asset.variation.sizes',
        {},
      ),
    }
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.mkdir(directory, { recursive: true })
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }
  }

  private buildAssetPath(
    assetName: string,
    options: { variantKey?: string; basePath: string } = { basePath: null },
  ): string {
    const { variantKey, basePath } = options
    const ext = path.extname(assetName)
    const basename = path.basename(assetName, ext)
    return variantKey
      ? path.join(
          basePath ? basePath : this.basePath,
          `${basename}-${variantKey}${ext}`,
        )
      : path.join(basePath ? basePath : this.basePath, assetName)
  }

  private async cleanUpFiles(files: string[]): Promise<void> {
    for (const filePath of files) {
      try {
        await fs.unlink(filePath)
      } catch (error) {
        console.error(`Failed to delete file: ${filePath}`, error)
      }
    }
  }

  private setSourcePath(asset: Asset, basePath?: string): void {
    asset.source = path.join(
      basePath ? basePath : __dirname,
      this.localPath,
      asset.name,
    )
  }

  async save(
    asset: Asset,
    file: Buffer,
    options?: { basePath?: string },
  ): Promise<void> {
    await this.ensureDirectoryExists(this.basePath)
    const filePath = this.buildAssetPath(asset.name, {
      basePath: options?.basePath,
    })
    await fs.writeFile(filePath, file)
    this.setSourcePath(asset, options?.basePath)
  }

  async saveImageWithScreenVariations(
    asset: Asset,
    file: Buffer,
    options?: { basePath?: string },
  ): Promise<void> {
    if (asset.type !== 'IMAGE')
      throw new UnsupportedFileError(
        'Only images are supported for this operation!',
      )
    await this.ensureDirectoryExists(this.basePath)

    const createdFiles: string[] = []
    try {
      const originalPath = this.buildAssetPath(asset.name)
      await fs.writeFile(originalPath, file)
      createdFiles.push(originalPath)

      for (const [key, size] of Object.entries(this.variationSizes)) {
        const resizedBuffer = await this.imageProcessor.resizeImage(file, size)
        const variationPath = this.buildAssetPath(asset.name, {
          basePath: options?.basePath,
          variantKey: key,
        })
        await fs.writeFile(variationPath, resizedBuffer)
        createdFiles.push(variationPath)
      }

      this.setSourcePath(asset, options?.basePath)
    } catch (error) {
      await this.cleanUpFiles(createdFiles)
      throw error
    }
  }

  async getAssetBy(asset: Asset): Promise<Buffer> {
    try {
      return await fs.readFile(asset.source)
    } catch (error) {
      console.error(`Error reading file: ${asset.source}`, error)
      throw error
    }
  }

  async delete(asset: Asset): Promise<void> {
    const basename = path.basename(asset.source)
    const basenameWithoutExt = path.basename(
      asset.source,
      path.extname(asset.source),
    )

    const filesToDelete = Object.keys(this.variationSizes).map((key) =>
      asset.source.replace(
        basename,
        `${basenameWithoutExt}-${key}${path.extname(asset.source)}`,
      ),
    )
    filesToDelete.push(asset.source)

    for (const filePath of filesToDelete) {
      try {
        await fs.access(filePath)
        await fs.unlink(filePath)
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn(`File not found, skipping deletion: ${filePath}`)
        } else {
          console.error(`Error deleting file: ${filePath}`, error)
          throw error
        }
      }
    }
  }

  // ! FOR TESTING PURPOSES ONLY
  async deleteAll(): Promise<void> {
    try {
      await fs.rm(this.basePath, { recursive: true })
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
}
