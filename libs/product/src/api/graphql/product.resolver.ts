import { UseInterceptors } from '@nestjs/common'
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'

import {
  Ctx,
  PaginatedItemsResponse,
  PaginatedResponseMeta,
  PaginationInput,
  RequestContext,
  RequestContextInterceptor,
} from '@av/common'

import { Product, CreateProductInput, UpdateProductInput } from './types'
import { ProductService } from '../../application/product.service'
import { FindProductsResponse } from './dto'

@Resolver(() => Product)
@UseInterceptors(RequestContextInterceptor)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => FindProductsResponse)
  async products(
    @Ctx() ctx: RequestContext,
    @Args('pagination') pagination?: PaginationInput,
  ): Promise<PaginatedItemsResponse<Product>> {
    return this.productService.findAll(ctx, pagination)
  }

  @Query(() => Product)
  async product(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Product> {
    return this.productService.findById(ctx, id)
  }

  @Mutation(() => Product)
  async createProduct(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateProductInput,
  ): Promise<Product> {
    return this.productService.create(ctx, input)
  }

  @Mutation(() => Product)
  async updateProduct(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateProductInput,
  ): Promise<Product> {
    return this.productService.update(ctx, id, input)
  }

  @Mutation(() => Product)
  async deleteProduct(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => String }) id: string,
  ): Promise<Product> {
    return this.productService.delete(ctx, id)
  }

  @Query(() => PaginatedResponseMeta)
  async searchProducts(
    @Ctx() ctx: RequestContext,
    @Args('query', { type: () => String }) query: string,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
  ): Promise<PaginatedItemsResponse<Product>> {
    return this.productService.search(ctx, query, { skip, take })
  }
}
