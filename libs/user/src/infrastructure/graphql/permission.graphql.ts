import { PaginatedResponseMeta } from '@av/common'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ObjectType()
export class Permission {
  @Field()
  @IsString()
  id: string

  @Field({ nullable: true })
  @IsString()
  specificScopeId?: string

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  action: string

  @Field()
  @IsString()
  resource: string

  @Field()
  @IsString()
  scope: string

  @Field({ nullable: true })
  @IsString()
  createdBy?: string

  @Field({ nullable: true })
  @IsString()
  updatedBy?: string

  @Field({ nullable: true })
  createdAt: Date

  @Field({ nullable: true })
  updatedAt: Date

  @Field({ nullable: true })
  deletedAt: Date

  isTypeOf(value: any) {
    return value instanceof Permission
  }
}

// Define the paginated response for roles
@ObjectType()
export class FindPermissionsResponseType {
  @Field(() => [Permission])
  items: Permission[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}

@InputType()
export class AssignSpecificScopeIdInput {
  @Field()
  @IsString()
  permissionId: string

  @Field()
  @IsString()
  specificScopeId: string
}
