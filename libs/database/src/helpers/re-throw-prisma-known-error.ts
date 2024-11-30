import { Prisma } from '@prisma/client'

export const reThrowPrismaKnownError = (error: any): Error => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) throw error
  return error
}
