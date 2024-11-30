import { UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import {
  Allow,
  Ctx,
  PaginationInput,
  Permission as PermissionEnum,
  RequestContext,
  RequestContextInterceptor,
} from '@av/common'
import {
  CreateRoleDto,
  RenameRoleDto,
  SetRolePermissionsDto,
} from '@av/user/application/graphql/dto/role.dto'
import { RoleService } from '@av/user/application/services/role.service'
import {
  CreateRoleResponse,
  FindRolesResponseType,
  Role,
} from '@av/user/infrastructure/graphql/role.graphql'

@Resolver(() => Role)
@UseInterceptors(RequestContextInterceptor)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Allow(PermissionEnum.CREATE_ROLE_GLOBAL, PermissionEnum.WRITE_ROLE_GLOBAL)
  @Mutation(() => CreateRoleResponse)
  async createRole(
    @Ctx() ctx: RequestContext,
    @Args('input') createUserInput: CreateRoleDto,
  ) {
    const role = await this.roleService.create(ctx, createUserInput)

    return role
  }

  @Allow(PermissionEnum.UPDATE_ROLE_GLOBAL, PermissionEnum.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async renameRoleById(
    @Ctx() ctx: RequestContext,
    @Args('input') renameRoleInput: RenameRoleDto,
  ) {
    const role = await this.roleService.renameById(
      ctx,
      renameRoleInput.id,
      renameRoleInput.name,
    )

    return role
  }

  @Allow(PermissionEnum.DELETE_ROLE_GLOBAL, PermissionEnum.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async removeRoleById(@Ctx() ctx: RequestContext, @Args('id') id: string) {
    const role = await this.roleService.delete(ctx, id)

    return role
  }

  @Allow(PermissionEnum.READ_ROLE_GLOBAL)
  @Query(() => FindRolesResponseType)
  async roles(
    @Ctx() ctx: RequestContext,
    @Args('input', { nullable: true }) pagination?: PaginationInput,
  ) {
    const rolesData = await this.roleService.getMany(ctx, pagination)

    return rolesData
  }

  @Allow(PermissionEnum.READ_ROLE_GLOBAL)
  @Query(() => Role, { nullable: true })
  async findRoleById(@Ctx() ctx: RequestContext, @Args('id') id: string) {
    const role = await this.roleService.getById(ctx, id)

    return role
  }

  @Allow(PermissionEnum.UPDATE_ROLE_GLOBAL, PermissionEnum.WRITE_ROLE_GLOBAL)
  @Mutation(() => Role)
  async setRolePermissions(
    @Ctx() ctx: RequestContext,
    @Args('input') setRolePermissionsInput: SetRolePermissionsDto,
  ) {
    const role = await this.roleService.setPermissions(
      ctx,
      setRolePermissionsInput.roleId,
      setRolePermissionsInput.permissionIds,
    )

    return role
  }
}
