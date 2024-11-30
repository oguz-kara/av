import { registerEnumType } from '@nestjs/graphql'

export enum ActionType {
  READ = 'READ',
  WRITE = 'WRITE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ALL = 'ALL',
}

registerEnumType(ActionType, {
  name: 'ActionType',
  description: 'The type of permission action',
})
