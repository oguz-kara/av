import { InputType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class EmailInput {
  @Field()
  @IsString()
  email: string
}
