import { Module } from '@nestjs/common'
import { SampleResolver } from './api/graphql/sample.resolver'

@Module({
  providers: [SampleResolver],
})
export class SampleAdminModule {}
