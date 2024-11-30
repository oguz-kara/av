import { Field, ObjectType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { UserType } from './user.graphql'

@ObjectType()
export class AuthenticateUserSuccess {
  @Field()
  @IsString()
  token: string
}

@ObjectType()
export class CreateUserAccountSuccess extends UserType {
  constructor() {
    super()
  }
}
