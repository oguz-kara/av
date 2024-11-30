import { Module } from '@nestjs/common'
import { RequestContextService } from './request-context.service'
import { RequestContextInterceptor } from './request-context.interceptor'
import { RequestContextMiddleware } from './request-context.middleware'

@Module({
  imports: [],
  providers: [
    RequestContextService,
    RequestContextInterceptor,
    RequestContextMiddleware,
  ],
  exports: [
    RequestContextService,
    RequestContextInterceptor,
    RequestContextMiddleware,
  ],
})
export class RequestContextModule {}
