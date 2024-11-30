import { Field, ObjectType } from '@nestjs/graphql'
import { Product } from './types'
import { PaginatedResponseMeta } from '@av/common'

@ObjectType()
export class AdminProductMessage {
  @Field()
  message: string
}

@ObjectType()
export class FindProductsResponse {
  @Field(() => [Product])
  items: Product[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
