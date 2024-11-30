import { registerEnumType } from '@nestjs/graphql'
import { AssetType } from '../../../domain/enums/asset-type.enum'

registerEnumType(AssetType, {
  name: 'AssetType',
  description: 'The type of the asset, e.g. image, video, document',
})
