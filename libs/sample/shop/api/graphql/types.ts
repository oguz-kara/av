import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SampleMessage {
  @Field(() => String)
  message: string
}
