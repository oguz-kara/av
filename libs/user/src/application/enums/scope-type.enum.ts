import { registerEnumType } from '@nestjs/graphql'

export enum ScopeType {
  GLOBAL = 'GLOBAL',
  SELF = 'SELF',
}

registerEnumType(ScopeType, {
  name: 'ScopeType',
  description: 'The type of scope',
})
