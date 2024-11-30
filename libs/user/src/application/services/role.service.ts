import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  ExceedingMaxLimitError,
  PaginatedItemsResponse,
  PaginationParams,
  PaginationValidator,
  RequestContext,
} from '@av/common'
import { PrismaService, Role } from '@av/database'
import { CreateRoleDto } from '../graphql/dto/role.dto'

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationValidator: PaginationValidator,
  ) {}

  async create(ctx: RequestContext, input: CreateRoleDto): Promise<Role> {
    const { name } = input

    const existedRole = await this.getByName(ctx, name)

    if (existedRole) {
      throw new ConflictException('Role already exists!')
    }

    const role = await this.prisma.role.create({
      data: {
        name,
        channelToken: ctx.channel.token,
        createdBy: ctx.userId,
      },
    })

    return role
  }

  async getById(ctx: RequestContext, id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    })

    return role
  }

  async getByName(ctx: RequestContext, name: string): Promise<Role | null> {
    const role = await this.prisma.role.findFirst({
      where: {
        name,
        channelToken: ctx.channel.token,
      },
    })

    return role
  }

  async getMany(
    ctx: RequestContext,
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<Role>> {
    const paginationParams =
      this.paginationValidator.validatePaginationParams(params)

    if (!paginationParams) {
      throw new ExceedingMaxLimitError()
    }

    const { skip, take } = paginationParams as PaginationParams

    const roles = await this.prisma.role.findMany({
      where: {
        channelToken: ctx.channel.token,
      },
      skip,
      take,
    })

    return {
      items: roles,
      pagination: {
        skip,
        take,
      },
    }
  }

  async renameById(
    ctx: RequestContext,
    id: string,
    name: string,
  ): Promise<Role> {
    const role = await this.getById(ctx, id)

    if (!role) {
      throw new NotFoundException('Role not found to rename!')
    }

    const roleName = await this.getByName(ctx, name)

    if (roleName) {
      throw new ConflictException('Role already exists! Try another name.')
    }

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: { name },
    })

    return updatedRole
  }

  async delete(ctx: RequestContext, id: string): Promise<Role> {
    const role = await this.getById(ctx, id)

    if (!role) {
      throw new NotFoundException('Role not found to remove!')
    }

    const removedRole = await this.prisma.role.delete({
      where: { id },
    })

    return removedRole
  }

  async setPermissions(
    ctx: RequestContext,
    roleId: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.getById(ctx, roleId)

    if (!role) {
      throw new NotFoundException(
        'Role not found to set permissions!',
        'ROLE_NOT_FOUND',
      )
    }

    const permissions = await this.prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
      },
    })

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException(
        'Some permission(s) not found! Please check the permission ID(s)',
        'PERMISSION_NOT_FOUND',
      )
    }

    const updatedRole = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          set: permissions.map((permission) => ({ id: permission.id })),
        },
      },
      include: { permissions: true },
    })

    return updatedRole
  }
}
