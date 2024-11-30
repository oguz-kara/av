import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { PasswordHasher } from './password-hasher.abstract'

@Injectable()
export class BcryptHasherService implements PasswordHasher {
  private readonly saltRounds = 10

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}
