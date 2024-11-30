import { UseInterceptors } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  FindUsersResponseType,
  UserType,
} from '@av/user/infrastructure/graphql/user.graphql'
import {
  AssignRoleInput,
  CreateUserArgs,
} from '@av/user/application/graphql/dto/user.dto'
import { UserService } from '@av/user/application/services/user.service'
import {
  Ctx,
  PaginationInput,
  RequestContext,
  RequestContextInterceptor,
} from '@av/common'
import { IDInput } from '@av/user/application/graphql/input/id.input'
import { EmailInput } from '@av/user/application/graphql/input/email.input'
import { Allow } from '@av/common'
import { Permission } from '@av/common'

@Resolver(() => UserType)
@UseInterceptors(RequestContextInterceptor)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Allow(Permission.CREATE_USER_GLOBAL, Permission.WRITE_USER_GLOBAL)
  @Mutation(() => UserType)
  async createUser(
    @Ctx() ctx: RequestContext,
    @Args({ type: () => CreateUserArgs }) { input }: CreateUserArgs,
  ) {
    const user = await this.userService.create(ctx, input)

    return user
  }

  @Allow(Permission.READ_USER_GLOBAL)
  @Query(() => FindUsersResponseType)
  async users(
    @Ctx() ctx: RequestContext,

    @Args('input', { nullable: true }) pagination?: PaginationInput,
  ) {
    const userData = await this.userService.getMany(ctx, pagination)

    return userData
  }

  @Allow(Permission.READ_USER_GLOBAL)
  @Query(() => UserType, { nullable: true })
  async findUserById(
    @Ctx() ctx: RequestContext,
    @Args('input') findUserInput: IDInput,
  ) {
    const { id } = findUserInput
    const user = await this.userService.getUserById(ctx, id)

    return user
  }

  @Allow(Permission.READ_USER_GLOBAL)
  @Query(() => UserType, { nullable: true })
  async findUserByEmail(
    @Ctx() ctx: RequestContext,
    @Args('input') findUserInput: EmailInput,
  ) {
    const { email } = findUserInput
    const user = await this.userService.getByEmail(ctx, email)

    return user
  }

  @Allow(Permission.UPDATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => UserType)
  async assignRoleToUser(
    @Ctx() ctx: RequestContext,
    @Args('input') assignRoleInput: AssignRoleInput,
  ) {
    const { roleId, userId } = assignRoleInput

    const user = await this.userService.setRole(ctx, userId, roleId)

    return user
  }
}
