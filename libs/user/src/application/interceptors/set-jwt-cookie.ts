import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ConfigService } from '@nestjs/config'
import { Response, Request } from 'express'

@Injectable()
export class SetJwtCookieInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isGraphQL = (context.getType() as string) === 'graphql'
    const isSecure = this.configService.get<string>('NODE_ENV') === 'production'
    const authStrategy = this.configService.get<string>(
      'authentication.strategy',
    )

    if (isGraphQL) {
      const gqlContext = GqlExecutionContext.create(context).getContext()
      const req: Request = gqlContext.req // Incoming request

      return next.handle().pipe(
        tap((allData) => {
          if (authStrategy === 'cookie' && allData && allData.token) {
            const cookieOptions = {
              httpOnly: true,
              secure: isSecure,
              maxAge: 3600000,
              path: '/',
            }
            req.res.cookie('avara_access_token', allData.token, cookieOptions)
          }
        }),
      )
    } else {
      const httpContext = context.switchToHttp()
      const res: Response = httpContext.getResponse()

      return next.handle().pipe(
        tap((allData) => {
          if (authStrategy === 'cookie' && allData && allData.accessToken) {
            const cookieOptions = {
              httpOnly: true,
              secure: isSecure,
              maxAge: 3600000, // 1 hour
              path: '/',
            }
            res.cookie('jwt', allData.accessToken, cookieOptions)
          }
        }),
      )
    }
  }
}
