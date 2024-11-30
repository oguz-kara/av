import { Field, ObjectType, InputType, ID } from '@nestjs/graphql'

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  slug: string

  @Field({ nullable: true })
  description?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field()
  createdBy: string

  @Field({ nullable: true })
  updatedBy?: string
}

@InputType()
export class CreateProductInput {
  @Field()
  name: string

  @Field()
  slug: string

  @Field({ nullable: true })
  description?: string
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  price?: number
}
