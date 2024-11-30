import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const Ctx = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest()
      return request.requestContext
    } else if ((context.getType() as string) === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context)
      return gqlContext.getContext().requestContext
    }
  },
)
