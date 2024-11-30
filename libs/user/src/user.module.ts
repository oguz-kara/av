import { Module } from '@nestjs/common'
import {
  AuthResolver,
  AuthService,
  AuthStorageService,
  BcryptHasherService,
  PasswordService,
  PermissionResolver,
  PermissionService,
  RoleResolver,
  RoleService,
  UserResolver,
  UserService,
} from '.'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PaginationValidator, RequestContextModule } from '@av/common'
import { PrismaService } from '@av/database'

@Module({
  imports: [
    RequestContextModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    AuthStorageService,
    BcryptHasherService,
    PasswordService,
    PermissionResolver,
    PermissionService,
    RoleResolver,
    RoleService,
    UserResolver,
    UserService,
    PaginationValidator,
    PrismaService,
  ],
})
export class UserModule {}
