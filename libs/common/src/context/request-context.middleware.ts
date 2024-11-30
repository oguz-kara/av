import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { RequestContextService } from './request-context.service'

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly contextService: RequestContextService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const requestContext = await this.contextService.createContext(
        req.headers,
      )
      this.contextService.setContext(requestContext)

      // @ts-expect-error error with requestContext type
      req.requestContext = requestContext

      // Add useful response headers
      res.setHeader('X-Request-ID', requestContext.requestId)
      res.setHeader('X-Channel-Code', requestContext.channel.code)

      next()
    } catch (error) {
      next(error)
    }
  }
}
