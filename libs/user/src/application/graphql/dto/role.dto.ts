import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsString } from 'class-validator'

@InputType()
export class CreateRoleDto {
  @Field()
  @IsString()
  name: string
}

@InputType()
export class RenameRoleDto {
  @Field()
  @IsString()
  id: string

  @Field()
  @IsString()
  name: string
}

@InputType()
export class SetRolePermissionsDto {
  @Field()
  @IsString()
  roleId: string

  @Field(() => [String])
  @IsArray()
  permissionIds: string[]
}
