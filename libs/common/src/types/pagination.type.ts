export interface PaginationMetaResponse
  extends PaginationMeta,
    PaginationParams {
  totalPages: number
}

export type PaginationParams = {
  take?: number
  skip?: number
}

export type PaginationMeta = {
  total?: number
}

export type PaginatedList<T> = {
  items: T[]
  pagination: PaginatedResponseMetaType
}

export type PaginatedResponseMetaType = PaginationParams & PaginationMeta

export type PaginatedItemsResponse<T> = {
  items: T[]
  pagination: PaginatedResponseMetaType
}
