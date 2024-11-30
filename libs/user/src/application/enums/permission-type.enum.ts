import { registerEnumType } from '@nestjs/graphql'

export enum PermissionType {
  GLOBAL = 'GLOBAL',
}

registerEnumType(PermissionType, {
  name: 'PermissionType',
  description: 'The type of permission',
})
