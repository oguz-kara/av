import { Module } from '@nestjs/common'

import { PrismaModule } from '@av/database'
import { PaginationValidator, RequestContextModule } from '@av/common'

import { ProductService } from './application/product.service'
import { ProductResolver } from './api/graphql/product.resolver'

@Module({
  imports: [PrismaModule, RequestContextModule],
  providers: [ProductService, ProductResolver, PaginationValidator],
  exports: [ProductService],
})
export class ProductModule {}
