import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@InputType()
export class CreateRolePermissionDto {
  @Field()
  @IsString()
  roleId: string

  @Field()
  @IsString()
  permissionId: string

  @Field()
  @IsBoolean()
  isActive: boolean
}

@InputType()
export class UpdateRolePermissionDto {
  @Field({ nullable: true })
  @IsString()
  roleId?: string

  @Field({ nullable: true })
  @IsString()
  permissionId?: string

  @Field()
  @IsBoolean()
  isActive: string
}
