import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as multer from 'multer'
import {
  AssetService,
  FileTypeService,
  ImageProcessor,
  LocalStorageStrategy,
  StorageStrategyFactory,
  FilenameNormalizer,
  AssetController,
} from '.'
import { PaginationValidator, RequestContextModule } from '@av/common'
import { PrismaService } from '@av/database'

@Module({
  imports: [
    RequestContextModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        storage: multer.memoryStorage(),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AssetController,
    AssetService,
    FileTypeService,
    ImageProcessor,
    LocalStorageStrategy,
    StorageStrategyFactory,
    FilenameNormalizer,
    PaginationValidator,
    PrismaService,
  ],
  controllers: [AssetController],
  exports: [AssetController],
})
export class AssetModule {}
