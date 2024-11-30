import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsEnum } from 'class-validator'
import { ActionType, ResourceType, ScopeType } from '../../enums'
import { PermissionType } from '../../enums/permission-type.enum'

@InputType()
export class CreatePermissionDto {
  @Field({ nullable: true })
  @IsString()
  specificScopeId?: string

  @Field(() => ActionType)
  @IsEnum(ActionType)
  action: ActionType

  @Field(() => ResourceType)
  @IsEnum(ResourceType)
  resource: ResourceType

  @Field(() => ScopeType)
  @IsEnum(ScopeType)
  scope: ScopeType

  @Field(() => ActionType, { nullable: true })
  @IsEnum(PermissionType)
  permissionType?: PermissionType
}

@InputType()
export class UpdatePermissionDto {
  @Field({ nullable: true })
  @IsString()
  specificScopeId?: string

  @Field(() => ActionType, { nullable: true })
  @IsEnum(ActionType)
  action?: ActionType

  @Field(() => ResourceType, { nullable: true })
  @IsEnum(ResourceType)
  resource?: ResourceType

  @Field(() => ScopeType, { nullable: true })
  @IsEnum(ScopeType)
  scope?: ScopeType

  @Field(() => ActionType, { nullable: true })
  @IsEnum(PermissionType)
  permissionType?: PermissionType
}
