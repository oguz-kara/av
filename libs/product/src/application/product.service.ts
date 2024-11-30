import { Injectable } from '@nestjs/common'

import { PrismaService, Product, Prisma } from '@av/database'
import {
  ExceedingMaxLimitError,
  PaginatedItemsResponse,
  PaginationParams,
  RequestContext,
} from '@av/common'
import { PaginationValidator } from '@av/common/utils/pagination.validator'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationValidator: PaginationValidator,
  ) {}

  async create(
    ctx: RequestContext,
    data: Omit<Prisma.ProductCreateInput, 'channelToken'>,
  ): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...data,
        createdBy: 'system',
        channelToken: ctx.channel.token,
      },
    })
  }

  async findById(ctx: RequestContext, id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id, channelToken: ctx.channel.token },
    })

    return product
  }

  async findAll(
    ctx: RequestContext,
    params?: {
      skip?: number
      take?: number
      cursor?: Prisma.ProductWhereUniqueInput
      where?: Prisma.ProductWhereInput
      orderBy?: Prisma.ProductOrderByWithRelationInput
    },
  ): Promise<PaginatedItemsResponse<Product>> {
    const { cursor, where, orderBy } = params || {}

    const validatedPaginatedParams =
      this.paginationValidator.validatePaginationParams({
        skip: params?.skip,
        take: params?.take,
      })

    if (!validatedPaginatedParams)
      throw new ExceedingMaxLimitError('Invalid pagination parameters')

    const { skip, take } = validatedPaginatedParams as PaginationParams

    const items = await this.prisma.product.findMany({
      skip: skip ?? 0,
      take: take ?? 10,
      cursor,
      where: { ...where, channelToken: ctx.channel.token },
      orderBy,
    })

    console.log({ skip, take })

    return {
      items,
      pagination: {
        skip,
        take,
      },
    }
  }

  async update(
    ctx: RequestContext,
    id: string,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product> {
    await this.findById(ctx, id) // Ensure product exists

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        updatedBy: 'system',
      },
    })
  }

  async delete(ctx: RequestContext, id: string): Promise<Product> {
    await this.findById(ctx, id) // Ensure product exists

    return this.prisma.product.delete({
      where: { id, channelToken: ctx.channel.token },
    })
  }

  async markAsDeleted(ctx: RequestContext, id: string): Promise<Product> {
    await this.findById(ctx, id) // Ensure product exists

    return this.prisma.product.update({
      where: { id, channelToken: ctx.channel.token },
      data: {
        deletedAt: new Date(),
        deletedBy: 'system',
      },
    })
  }

  async search(
    ctx: RequestContext,
    query: string,
    params?: {
      skip?: number
      take?: number
      where?: Prisma.ProductWhereInput
    },
  ): Promise<PaginatedItemsResponse<Product>> {
    const { skip, take, where } = params || {}

    const items = await this.prisma.product.findMany({
      where: {
        ...where,
        channelToken: ctx.channel.token,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip,
      take,
    })

    return {
      items,
      pagination: {
        skip,
        take,
      },
    }
  }
}
