import { Field, ObjectType, InputType, Int } from '@nestjs/graphql'

@ObjectType()
export class Channel {
  @Field(() => Int)
  id: number

  @Field()
  code: string

  @Field()
  name: string

  @Field()
  token: string

  @Field()
  isDefault: boolean

  @Field()
  type: string

  @Field()
  currencyCode: string

  @Field()
  defaultLanguageCode: string

  @Field()
  createdBy: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@InputType()
export class CreateChannelInput {
  @Field()
  code: string

  @Field()
  name: string

  @Field({ nullable: true })
  isDefault?: boolean

  @Field()
  type: string

  @Field()
  currencyCode: string

  @Field()
  defaultLanguageCode: string
}

@InputType()
export class UpdateChannelInput {
  @Field({ nullable: true })
  code?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  isDefault?: boolean

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  currencyCode?: string

  @Field({ nullable: true })
  defaultLanguageCode?: string
}
