import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { ChannelService } from '../../application/channel.service'
import { Channel, CreateChannelInput, UpdateChannelInput } from './types'
import { Ctx, RequestContext } from '@av/common'
import { ChannelType } from '@prisma/client'

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => [Channel])
  async channels(@Ctx() ctx: RequestContext): Promise<Channel[]> {
    return this.channelService.listChannels(ctx)
  }

  @Query(() => Channel)
  async channel(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Channel> {
    return this.channelService.getChannelById(ctx, id)
  }

  @Mutation(() => Channel)
  async createChannel(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateChannelInput,
  ): Promise<Channel> {
    return this.channelService.createChannel(ctx, {
      ...input,
    } as any)
  }

  @Mutation(() => Channel)
  async updateChannel(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateChannelInput,
  ): Promise<Channel> {
    return this.channelService.updateChannel(ctx, id, {
      ...input,
      type: input.type as ChannelType,
    })
  }

  @Mutation(() => Channel)
  async deleteChannel(
    @Ctx() ctx: RequestContext,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Channel> {
    return this.channelService.deleteChannel(ctx, id)
  }

  @Query(() => Channel)
  async getOrCreateDefaultChannel(
    @Ctx() ctx: RequestContext,
    @Args('token') token: string,
  ): Promise<Channel> {
    return this.channelService.getOrCreateDefaultChannel(ctx, token)
  }
}
