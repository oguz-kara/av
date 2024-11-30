import { PrismaClient } from '@prisma/client'

export interface DbRepositoryMetadata {
  transaction?: PrismaClient
}

export type DbTransactionalClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0]
