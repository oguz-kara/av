import { AssetService } from '@av/asset/application/services/asset.service'
import {
  Allow,
  Ctx,
  PaginationParams,
  Permission,
  RequestContext,
  RequestContextInterceptor,
} from '@av/common'
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Delete,
  Param,
  Get,
  Query,
  Body,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'

@Controller('assets')
@UseInterceptors(RequestContextInterceptor)
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Allow(
    Permission.CREATE_ASSET_GLOBAL,
    Permission.MANAGE_ASSET_GLOBAL,
    Permission.WRITE_ASSET_GLOBAL,
  )
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAsset(
    @UploadedFile() file: Express.Multer.File,
    @Ctx() ctx: RequestContext,
  ) {
    return await this.assetService.uploadAsset(ctx, file)
  }

  @Allow(
    Permission.CREATE_ASSET_GLOBAL,
    Permission.MANAGE_ASSET_GLOBAL,
    Permission.WRITE_ASSET_GLOBAL,
  )
  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Ctx() ctx: RequestContext,
  ) {
    return await this.assetService.uploadMultipleAssets(ctx, files)
  }

  @Allow(
    Permission.DELETE_ASSET_GLOBAL,
    Permission.MANAGE_ASSET_GLOBAL,
    Permission.WRITE_ASSET_GLOBAL,
  )
  @Delete('delete-all')
  async deleteAll(@Ctx() ctx: RequestContext) {
    await this.assetService.deleteAll(ctx)

    return { message: 'All assets deleted' }
  }

  @Allow(
    Permission.DELETE_ASSET_GLOBAL,
    Permission.MANAGE_ASSET_GLOBAL,
    Permission.WRITE_ASSET_GLOBAL,
  )
  @Delete('multiple')
  deleteFiles(@Ctx() ctx: RequestContext, @Body() body: { ids: string[] }) {
    const ids = body.ids

    return this.assetService.deleteManyAsset(ctx, ids)
  }

  @Allow(
    Permission.DELETE_ASSET_GLOBAL,
    Permission.MANAGE_ASSET_GLOBAL,
    Permission.WRITE_ASSET_GLOBAL,
  )
  @Delete(':id')
  deleteFile(@Ctx() ctx: RequestContext, @Param('id') id: string) {
    return this.assetService.deleteAsset(ctx, id)
  }

  @Allow(Permission.READ_ASSET_GLOBAL, Permission.MANAGE_ASSET_GLOBAL)
  @Get('multiple')
  async getList(@Ctx() ctx: RequestContext, @Query() query: PaginationParams) {
    const { skip, take } = query

    return await this.assetService.findMany(ctx, {
      skip,
      take,
    })
  }

  @Allow(Permission.READ_ASSET_GLOBAL, Permission.MANAGE_ASSET_GLOBAL)
  @Get(':id')
  async getOneById(@Ctx() ctx: RequestContext, @Param('id') id: string) {
    return await this.assetService.findById(ctx, id)
  }
}
