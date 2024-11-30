import { DomainException } from './domain-exception.abstract'

export class UserInputException extends DomainException {
  constructor(message: string = 'Invalid user input') {
    super(message, 'USER_INPUT_EXCEPTION')
  }
}

export class PaginationLimitExceededException extends UserInputException {
  constructor(maxAllowed: number) {
    super(
      `Cannot request more than ${maxAllowed} items in a paginated query. Please reduce the limit and try again.`,
    )
  }
}
