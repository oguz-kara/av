import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  PaginationParams,
  PaginatedItemsResponse,
  PaginationValidator,
  RequestContext,
  ExceedingMaxLimitError,
} from '@av/common'
import { CreateUserDto } from '../graphql/dto/user.dto'
import { User, PrismaService } from '@av/database'
import { Permission as PermissionEnum } from '@av/common'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationValidator: PaginationValidator,
  ) {}

  async getUserById(ctx: RequestContext, id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return user
  }

  async getByEmail(ctx: RequestContext, email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return user
  }

  async getMany(
    ctx: RequestContext,
    params: PaginationParams,
  ): Promise<PaginatedItemsResponse<User>> {
    const paginationParams =
      this.paginationValidator.validatePaginationParams(params)

    if (!paginationParams) throw new ExceedingMaxLimitError()

    const { skip, take } = paginationParams as PaginationParams

    const users = await this.prisma.user.findMany({ skip, take })

    return {
      items: users,
      pagination: {
        skip,
        take,
      },
    }
  }

  async setEmail(ctx: RequestContext, id: string, email: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })

    if (!user) throw new NotFoundException('User not found!')

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { email },
    })

    return updatedUser
  }

  async getPermissions(ctx: RequestContext, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    })

    if (!user) throw new NotFoundException('User not found!', 'USER_NOT_FOUND')

    const permissions = user.role.permissions.map(
      (permission) =>
        `${permission.resource}:${permission.action}:${permission.scope}`,
    ) as PermissionEnum[]

    return permissions
  }

  async create(ctx: RequestContext, user: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    })

    if (existingUser) {
      throw new ConflictException('User already exists!', 'USER_ALREADY_EXISTS')
    }

    const role = await this.prisma.role.findUnique({
      where: { id: user.roleId },
    })

    if (!role)
      throw new NotFoundException(
        'User role not found to assign!',
        'ROLE_NOT_FOUND',
      )

    const createdUser = await this.prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.password,
        emailVerified: user.emailVerified,
        roleId: user.roleId,
        isActive: user.isActive,
      },
    })

    return createdUser
  }

  async setRole(ctx: RequestContext, userId: string, roleId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    if (!user)
      throw new NotFoundException(
        'User not found to assign role!',
        'USER_NOT_FOUND',
      )

    const role = await this.prisma.role.findUnique({ where: { id: roleId } })

    if (!role)
      throw new NotFoundException(
        'Role not found to assign to user!',
        'ROLE_NOT_FOUND',
      )

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id },
    })

    return updatedUser
  }
}
