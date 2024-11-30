import { registerEnumType } from '@nestjs/graphql'

export enum UserActiveStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

registerEnumType(UserActiveStatus, {
  name: 'UserActiveStatus',
  description: 'The active status of a user',
})
