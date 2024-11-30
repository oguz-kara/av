import { Resolver } from '@nestjs/graphql'
import { Query } from '@nestjs/graphql'
import { SampleMessage } from './types'

@Resolver()
export class SampleResolver {
  @Query(() => SampleMessage)
  async hello() {
    return { message: 'Hello From Shop API!' }
  }
}
