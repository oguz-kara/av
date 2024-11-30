import { InputType, Field, ArgsType } from '@nestjs/graphql'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator'
import { UserActiveStatus } from '../../../domain/enums/user-active-status.enum'
import { Type } from 'class-transformer'

@InputType()
export class ChangeEmailInput {
  @Field()
  @IsString()
  userId: string

  @Field()
  @IsString()
  @IsEmail()
  email: string
}

@InputType()
export class AssignRoleInput {
  @Field()
  @IsString()
  userId: string

  @Field()
  @IsString()
  roleId: string
}

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  password: string

  @Field()
  @IsString()
  roleId: string

  @Field()
  @IsBoolean()
  emailVerified: boolean

  @Field(() => UserActiveStatus)
  @IsEnum(UserActiveStatus)
  isActive: UserActiveStatus
}

@ArgsType()
export class CreateUserArgs {
  @Field(() => CreateUserDto)
  @Type(() => CreateUserDto)
  @ValidateNested()
  input: CreateUserDto
}

export class CreateUserResponse {
  @Field()
  @IsString()
  email: string

  @Field()
  @IsString()
  roleId: string

  @Field()
  @IsBoolean()
  emailVerified: boolean

  @Field(() => UserActiveStatus)
  @IsEnum(UserActiveStatus)
  isActive: UserActiveStatus
}
