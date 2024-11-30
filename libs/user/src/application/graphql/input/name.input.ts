import { InputType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class NameInput {
  @Field()
  @IsString()
  name: string
}
