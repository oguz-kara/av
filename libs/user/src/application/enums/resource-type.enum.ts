import { registerEnumType } from '@nestjs/graphql'

export enum ResourceType {
  USER = 'USER',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
  BLOG_POST_CATEGORY = 'BLOG_POST_CATEGORY',
  BLOG_POST = 'BLOG_POST',
}

registerEnumType(ResourceType, {
  name: 'ResourceType',
  description: 'The type of resource',
})
