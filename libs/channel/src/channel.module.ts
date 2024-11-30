import { Module } from '@nestjs/common'
import { ChannelResolver } from './api/graphql/channel.resolver'
import { ChannelService } from './application/channel.service'
import { RequestContextModule } from '@av/common'
import { PrismaModule } from '@av/database'

@Module({
  imports: [PrismaModule, RequestContextModule],
  providers: [ChannelResolver, ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
