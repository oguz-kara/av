import { Injectable } from '@nestjs/common'
import { BcryptHasherService } from './bcryp-hasher.service'

@Injectable()
export class PasswordService {
  constructor(private readonly hasherService: BcryptHasherService) {}

  async hashPassword(rawPassword: string): Promise<string> {
    return await this.hasherService.hashPassword(rawPassword)
  }

  validatePassword(
    rawPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return this.hasherService.comparePasswords(rawPassword, hashedPassword)
  }
}
