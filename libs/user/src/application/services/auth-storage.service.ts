import { Injectable } from '@nestjs/common'
import { AuthType } from '../../domain/enums/auth-types.enum'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthStorageService {
  private authStrategies: Map<string, AuthType> = new Map()

  constructor(private readonly configService: ConfigService) {
    const defaultStrategy = this.configService.get<AuthType | undefined>(
      'authentication.strategy',
    )
    if (defaultStrategy) {
      this.authStrategies.set('default', defaultStrategy)
    } else {
      this.authStrategies.set('default', AuthType.BEARER)
    }

    this.authStrategies.set('default', AuthType.BEARER)
  }

  setStrategy(key: string, authType: AuthType) {
    this.authStrategies.set(key, authType)
  }

  getStrategy(key: string): AuthType {
    return this.authStrategies.get(key) || AuthType.BEARER
  }
}
