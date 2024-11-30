import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { Permission, RequestContext } from '@av/common'
import { User } from '@av/database'

import { UserService } from './user.service'
import { PasswordService } from '../../infrastructure/services/password.service'
import { RegisterUserDto } from '../graphql/dto/register-user.dto'
import { LoginUserDto } from '../graphql/dto/login-user.dto'
import {
  AuthenticateUserSuccess,
  CreateUserAccountSuccess,
} from '../../infrastructure/graphql/auth.graphql'
import { RoleService } from './role.service'
import { PermissionService } from './permission.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly pwService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    ctx: RequestContext,
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.getByEmail(ctx, email)
    if (
      user &&
      (await this.pwService.validatePassword(password, user.passwordHash))
    ) {
      return user
    }
    return null
  }

  async createUserAccount(
    ctx: RequestContext,
    { email, password, roleId, isActive }: RegisterUserDto,
  ): Promise<CreateUserAccountSuccess> {
    const user = await this.userService.getByEmail(ctx, email)

    if (user) {
      throw new ConflictException(`User with email ${email} already exists.`)
    }

    const role = await this.roleService.getById(ctx, roleId)
    if (!role) throw new NotFoundException(`Role with ID ${roleId} not found.`)

    const passwordHash = await this.pwService.hashPassword(password)

    const newUser = {
      password: passwordHash,
      email,
      roleId,
      isActive,
      emailVerified: false,
    }

    const createdUser = await this.userService.create(ctx, newUser)

    return createdUser as CreateUserAccountSuccess
  }

  async authenticateUser(
    ctx: RequestContext,
    { email, password }: LoginUserDto,
  ): Promise<AuthenticateUserSuccess> {
    const user = await this.validateUser(ctx, email, password)
    if (!user) throw new ConflictException('Invalid credentials!')

    const token = this.signToken(user.id, user.email)
    return { token }
  }

  signToken(userId: string, email: string): string {
    const payload = { userId, email }
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWTsECRET'),
      expiresIn: this.configService.get('authentication.jwt.expiresIn'),
    })
  }

  async isAuthorizedToPerformAction(
    ctx: RequestContext,
    userId: string,
    requiredPermissions: Permission[],
    operator: 'OR' | 'AND',
  ): Promise<boolean> {
    const user = await this.userService.getUserById(ctx, userId)
    if (!user) throw new ConflictException('User not found!')

    const permissions = await this.permissionService.getManyByRoleId(
      ctx,
      user.roleId,
    )
    const permissionNames = permissions.map(
      (permission) =>
        `${permission.resource}:${permission.action}:${permission.scope}`,
    ) as Permission[]

    if (operator === 'OR') {
      return requiredPermissions.some((permission) =>
        permissionNames.includes(permission),
      )
    } else {
      return requiredPermissions.every((permission) =>
        permissionNames.includes(permission),
      )
    }
  }
}
