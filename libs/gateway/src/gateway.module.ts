import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'

import { ProductModule } from '@av/product'
import { ChannelModule } from '@av/channel'
import { RequestContextModule } from '@av/common'
import { AssetModule } from '@av/asset'
import { UserModule } from '@av/user'

@Module({
  imports: [
    ChannelModule,
    RequestContextModule,
    ProductModule,
    AssetModule,
    UserModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: true,
      driver: ApolloDriver,
      path: '/admin-api',
      playground: true,
      include: [ChannelModule, ProductModule, UserModule, AssetModule],
      // autoSchemaFile: 'schema.graphql',
      typePaths: [
        join(process.cwd(), 'libs/common/src/graphql/admin/schema.graphql'),
      ],
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   debug: true,
    //   driver: ApolloDriver,
    //   path: '/shop-api',
    //   include: [],
    //   playground: true,
    //   typePaths: [
    //     join(process.cwd(), 'libs/common/src/graphql/shop/**/*.graphql'),
    //   ],
    // }),
  ],
  providers: [],
})
export class GatewayModule {}
