import { SetMetadata } from '@nestjs/common'
import { Permission } from '../enums/permission'

export function Allow(...args: [Permission[]] | Permission[]): MethodDecorator {
  let permissions: Permission[]
  let operator: 'AND' | 'OR' = 'OR'

  if (Array.isArray(args[0])) {
    permissions = args[0]
    operator = 'AND'
  } else {
    permissions = args as Permission[]
    operator = 'OR'
  }

  return SetMetadata('permissionData', { items: permissions, operator })
}
