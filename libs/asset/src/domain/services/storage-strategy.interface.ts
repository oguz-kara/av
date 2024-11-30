import { Asset } from '@av/database'

export interface StorageStrategy {
  save(
    asset: Asset,
    file: Buffer,
    options?: { basePath: string },
  ): Promise<void>
  saveImageWithScreenVariations(
    asset: Asset,
    file: Buffer,
    options?: { basePath: string },
  ): Promise<void>
  getAssetBy(asset: Asset): Promise<Buffer>
  delete(asset: Asset): Promise<void>
  deleteAll(): Promise<void>
}
