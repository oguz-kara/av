import { Global, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PaginationParams } from '../types'

@Global()
@Injectable()
export class PaginationValidator {
  constructor(private readonly configService: ConfigService) {}

  validatePaginationParams(args: PaginationParams): PaginationParams | boolean {
    const { skip, take } = this.resolvePaginationConfig(args)

    return this.isExceedingMaxLimit(take) ? false : { take, skip }
  }

  private resolvePaginationConfig(args: PaginationParams): PaginationParams {
    return {
      take: !isNaN(Number(args?.take))
        ? Math.abs(args.take)
        : this.configService.get<number>('pagination.limits.default'),
      skip: !isNaN(Number(args?.skip))
        ? Math.abs(args.skip)
        : this.configService.get<number>('pagination.defaultPosition'),
    }
  }

  private isExceedingMaxLimit(take: number) {
    const maxLimit = this.configService.get<number>('pagination.limits.max')

    return take > maxLimit
  }
}
