import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { RequestContextService } from './request-context.service'

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(private readonly contextService: RequestContextService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const requestContext = await this.getRequestContext(context)

    if (requestContext) {
      this.contextService.setContext(requestContext)
      this.attachContextToRequest(context, requestContext)
    }

    return next.handle()
  }

  private async getRequestContext(context: ExecutionContext) {
    if (context.getType() === 'http') {
      // REST endpoint
      const request = context.switchToHttp().getRequest()
      return this.contextService.createContext(request.headers)
    } else if ((context.getType() as string) === 'graphql') {
      // GraphQL endpoint
      const gqlContext = GqlExecutionContext.create(context)
      const { req } = gqlContext.getContext()
      return this.contextService.createContext(req.headers)
    }
  }

  private attachContextToRequest(
    context: ExecutionContext,
    requestContext: any,
  ) {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest()
      request.requestContext = requestContext
    } else if ((context.getType() as string) === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context)
      gqlContext.getContext().requestContext = requestContext
    }
  }
}
