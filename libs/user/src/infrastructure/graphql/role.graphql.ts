import { PaginatedResponseMeta } from '@av/common'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@ObjectType()
export class Role {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  channelToken?: string
}

@ObjectType()
export class CreateRoleResponse {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string
}

@ObjectType()
export class FindRolesResponseType {
  @Field(() => [Role])
  items: Role[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
