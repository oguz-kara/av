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
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../graphql/dto/permission.dto'
import {
  ActionType,
  Permission,
  PermissionType,
  PrismaService,
  ResourceType,
  ScopeType,
} from '@av/database'

@Injectable()
export class PermissionService {
  constructor(
    private readonly paginationValidator: PaginationValidator,
    private readonly prisma: PrismaService,
  ) {}

  async createPermission(ctx: RequestContext, input: CreatePermissionDto) {
    const { action, resource, scope } = input
    const existedPermission = await this.getByName(ctx, {
      action: action as ActionType,
      resource: resource as ResourceType,
      scope: scope as ScopeType,
    })

    if (existedPermission)
      throw new ConflictException('Permission already exists!')

    const permission = await this.prisma.permission.create({
      data: {
        action: action as ActionType,
        resource: resource as ResourceType,
        scope: scope as ScopeType,
      },
    })

    return permission
  }

  async getById(ctx: RequestContext, id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    })

    return permission
  }

  async getByName(
    ctx: RequestContext,
    {
      action,
      resource,
      scope,
    }: { action: ActionType; resource: ResourceType; scope: ScopeType },
  ): Promise<Permission | null> {
    const permission = await this.prisma.permission.findFirst({
      where: {
        action,
        resource,
        scope,
      },
    })

    return permission
  }

  async getMany(
    ctx: RequestContext,
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<Permission>> {
    const paginationParams =
      this.paginationValidator.validatePaginationParams(params)

    if (!paginationParams) throw new ExceedingMaxLimitError()

    const { skip, take } = paginationParams as PaginationParams

    const permissions = await this.prisma.permission.findMany({ skip, take })

    return {
      items: permissions,
      pagination: {
        skip,
        take,
      },
    }
  }

  async editDetails(
    ctx: RequestContext,
    id: string,
    input: UpdatePermissionDto,
  ) {
    const { action, resource, scope, permissionType, specificScopeId } = input
    const permission = await this.getById(ctx, id)

    if (!permission) throw new NotFoundException('Permission not found!')

    const removedPermission = await this.prisma.permission.update({
      where: { id },
      data: {
        action: action as ActionType,
        resource: resource as ResourceType,
        scope: scope as ScopeType,
        permissionType: permissionType as PermissionType,
        specificScopeId,
      },
    })

    return removedPermission
  }

  async delete(ctx: RequestContext, id: string) {
    const permission = await this.getById(ctx, id)

    if (!permission) throw new NotFoundException('Permission not found!')

    const removedPermission = await this.prisma.permission.delete({
      where: { id },
    })

    return removedPermission
  }

  async markAsDeleted(ctx: RequestContext, id: string) {
    const permission = await this.getById(ctx, id)

    if (!permission) throw new NotFoundException('Permission not found!')

    const softDeletedPermission = await this.prisma.permission.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: 'system' },
    })

    return softDeletedPermission
  }

  async recover(ctx: RequestContext, id: string) {
    const permission = await this.getById(ctx, id)

    if (!permission) throw new NotFoundException('Permission not found!')

    const recoveredPermission = await this.prisma.permission.update({
      where: { id },
      data: {
        deletedAt: null,
        deletedBy: null,
      },
    })

    return recoveredPermission
  }

  async getManyByRoleId(ctx: RequestContext, roleId: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId, channelToken: ctx.channel.token },
      include: {
        permissions: true,
      },
    })

    return role?.permissions
  }
}
