import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  FindPermissionsResponseType,
  Permission as PermissionEntity,
} from '@av/user/infrastructure/graphql/permission.graphql'
import { PermissionService } from '@av/user/application/services/permission.service'
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../../application/graphql/dto/permission.dto'
import { IDInput } from '../../application/graphql/input/id.input'
import {
  Allow,
  Ctx,
  PaginationInput,
  Permission,
  RequestContext,
} from '@av/common'

@Resolver(() => PermissionEntity)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Allow(
    Permission.CREATE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async createPermission(
    @Ctx() ctx: RequestContext,
    @Args('input') createUserInput: CreatePermissionDto,
  ) {
    return await this.permissionService.createPermission(ctx, createUserInput)
  }

  @Allow(
    Permission.UPDATE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async editPermissionDetails(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
    @Args('input') updatePermissionInput: UpdatePermissionDto,
  ) {
    return await this.permissionService.editDetails(
      ctx,
      id,
      updatePermissionInput,
    )
  }

  @Allow(
    Permission.DELETE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async removePermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') removePermissionInput: IDInput,
  ) {
    return await this.permissionService.delete(
      ctx,
      removePermissionInput.id,
    )
  }

  @Allow(
    Permission.DELETE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async softRemovePermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') removePermissionInput: IDInput,
  ) {
    return await this.permissionService.markAsDeleted(
      ctx,
      removePermissionInput.id,
    )
  }

  @Allow(
    Permission.UPDATE_PERMISSION_GLOBAL,
    Permission.WRITE_PERMISSION_GLOBAL,
  )
  @Mutation(() => PermissionEntity)
  async recoverPermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') recoverPermissionInput: IDInput,
  ) {
    return await this.permissionService.recover(
      ctx,
      recoverPermissionInput.id,
    )
  }

  @Allow(Permission.READ_PERMISSION_GLOBAL)
  @Query(() => FindPermissionsResponseType)
  async permissions(
    @Ctx() ctx: RequestContext,
    @Args('input', { nullable: true }) pagination?: PaginationInput,
  ) {
    return await this.permissionService.getMany(ctx, pagination)
  }

  @Allow(Permission.READ_PERMISSION_GLOBAL)
  @Query(() => PermissionEntity, { nullable: true })
  async findPermissionById(
    @Ctx() ctx: RequestContext,
    @Args('input') findPermissionInput: IDInput,
  ) {
    const resolverPermission = await this.permissionService.getById(
      ctx,
      findPermissionInput.id,
    )

    return resolverPermission
  }
}
