import { PaginatedResponseMeta } from '@av/common'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { UserActiveStatus } from '@prisma/client'
import { IsOptional } from 'class-validator'

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string

  @Field(() => ID)
  roleId: string

  @Field(() => String)
  email: string

  @Field(() => String)
  isActive: UserActiveStatus

  @Field(() => Boolean)
  emailVerified: boolean

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => Date, { nullable: true })
  @IsOptional()
  deletedAt: Date

  @Field(() => String)
  createdBy: string

  @Field(() => String, { nullable: true })
  updatedBy: string

  @Field(() => String, { nullable: true })
  deletedBy: string

  static isTypeOf(value: any) {
    return value instanceof UserType
  }
}

@ObjectType()
export class CreateUserResponse {
  @Field(() => ID)
  id: string

  @Field(() => String)
  email: string

  @Field(() => String)
  isActive: UserActiveStatus

  @Field(() => String)
  emailVerified: boolean
}

// Define the paginated response for roles
@ObjectType()
export class FindUsersResponseType {
  @Field(() => [UserType])
  items: UserType[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
