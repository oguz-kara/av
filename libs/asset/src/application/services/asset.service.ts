import { Injectable } from '@nestjs/common'
import { FilenameNormalizer } from '../../domain/services/filename-normalizer.service'
import { ImageProcessor } from '../../domain/services/image-processor.service'
import { StorageStrategyFactory } from '../../infrastructure/factories/storage-strategy.factory'
import { FileProcessingContext } from '../../domain/services/file-processing-context'
import { FileTypeService } from '../../domain/services/file-type.service'
import { ConfigService } from '@nestjs/config'
import { FileMetadataExtractor } from '../../domain/utils/file-metadat-extractor.util'
import { NoFileUploadedError } from '../../domain/errors/no-file-uploaded-error'
import { FileTooLargeError } from '../../domain/errors/file-too-large-error'
import {
  ExceedingMaxLimitError,
  PaginatedList,
  PaginationParams,
  PaginationValidator,
  RequestContext,
} from '@av/common'
import {
  Asset,
  AssetType,
  DbTransactionalClient,
  PrismaService,
} from '@av/database'

type FileMetadata = {
  mimeType: string
  fileSize: number
  width?: number
  height?: number
}

@Injectable()
export class AssetService {
  private variationsEnabled: boolean
  constructor(
    private readonly filenameNormalizer: FilenameNormalizer,
    private readonly imageProcessor: ImageProcessor,
    private readonly storageFactory: StorageStrategyFactory,
    private readonly fileTypeService: FileTypeService,
    private readonly configService: ConfigService,
    private readonly paginationValidator: PaginationValidator,
    private readonly prisma: PrismaService,
  ) {
    this.variationsEnabled =
      this.configService.get<boolean>('asset.variation.variationsEnabled') ||
      false
  }

  async uploadAsset(
    ctx: RequestContext,
    file: Express.Multer.File,
    globalTx?: DbTransactionalClient,
  ): Promise<Asset> {
    if (!file) throw new NoFileUploadedError()

    let fileMetadata: FileMetadata

    const fileType = await this.fileTypeService.getFileTypeFromFile(file)

    const fileBuffer = file.buffer

    const maxFileSize = this.configService.get<number>(
      'asset.storage.maxFileSize',
    )

    if (fileBuffer.length > maxFileSize)
      throw new FileTooLargeError(maxFileSize / 1024 / 1024)

    const storageService = this.storageFactory.create()

    const context = FileProcessingContext.create(fileBuffer, file.originalname)

    context.normalizedFilename = this.filenameNormalizer.normalize(
      context.originalFilename,
      fileType,
    )

    if (fileType === 'IMAGE')
      fileMetadata = await this.imageProcessor.getBufferMetadata(fileBuffer)
    else
      fileMetadata = FileMetadataExtractor.extractMetadata(
        fileBuffer,
        file.originalname,
      )

    context.metadata = {
      ...fileMetadata,
      type: fileType as AssetType,
      source: 'not-added-yet',
    }

    return this.prisma.$transaction(async (transaction) => {
      const tx = globalTx ? globalTx : transaction
      const asset = context.getAsset(ctx)

      console.log({ asset })

      const createdAsset = await tx.asset.create({
        data: asset,
      })

      if (!this.variationsEnabled || fileType !== 'IMAGE')
        await storageService.save(createdAsset, fileBuffer)
      else
        await storageService.saveImageWithScreenVariations(
          createdAsset,
          fileBuffer,
        )

      const previewUrl =
        this.configService.get<string>('asset.storage.url') +
        '/' +
        context.normalizedFilename

      const savedAsset = await tx.asset.update({
        where: { id: createdAsset.id },
        data: { preview: previewUrl },
      })

      return savedAsset
    })
  }

  async uploadMultipleAssets(
    ctx: RequestContext,
    files: Express.Multer.File[],
  ): Promise<Asset[]> {
    if (!files || files.length === 0) throw new NoFileUploadedError()

    return await this.prisma.$transaction(async (tx) => {
      return await Promise.all(
        files.map(async (file) => {
          return await this.uploadAsset(ctx, file, tx)
        }),
      )
    })
  }

  async deleteAsset(ctx: RequestContext, assetId: string): Promise<Asset> {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId, channelToken: ctx.channel.token },
    })

    if (!asset) throw new Error('Asset not found')

    const storageService = this.storageFactory.create()

    const deletedAsset = await this.prisma.asset.delete({
      where: { id: assetId, channelToken: ctx.channel.token },
    })

    await storageService.delete(asset)

    return deletedAsset
  }

  async deleteManyAsset(
    ctx: RequestContext,
    assetIdList: string[],
  ): Promise<Asset[]> {
    return await Promise.all(
      assetIdList.map(async (assetId) => {
        return await this.deleteAsset(ctx, assetId)
      }),
    )
  }

  async findMany(
    ctx: RequestContext,
    params?: PaginationParams,
  ): Promise<PaginatedList<Asset>> {
    if (params.take && isNaN(Number(params.take))) {
      throw new Error('Invalid pagination parameters')
    }
    if (params.skip && isNaN(Number(params.skip))) {
      throw new Error('Invalid pagination parameters')
    }

    const paginationParams =
      this.paginationValidator.validatePaginationParams(params)

    if (!paginationParams) throw new ExceedingMaxLimitError()

    const { skip, take } = paginationParams as PaginationParams

    const assetData = await this.prisma.asset.findMany({
      where: { channelToken: ctx.channel.token },
      skip,
      take,
    })

    return {
      items: assetData,
      pagination: {
        skip,
        take,
      },
    }
  }

  async findById(ctx: RequestContext, assetId: string): Promise<Asset> {
    const asset = await this.prisma.asset.findUnique({
      where: { id: assetId, channelToken: ctx.channel.token },
    })

    return asset
  }

  async deleteAll(ctx: RequestContext): Promise<void> {
    await this.prisma.asset.deleteMany({
      where: { channelToken: ctx.channel.token },
    })

    const assetStorage = this.storageFactory.create()

    await assetStorage.deleteAll()
  }
}
