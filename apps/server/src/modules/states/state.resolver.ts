import { PrismaClient } from '@instabrand/data'
import { Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { State } from './state.schema'

@Resolver(State)
@Service()
export class StateResolver {
  constructor(private readonly prisma: PrismaClient) {}

  @Query(() => [State])
  async states() {
    return await this.prisma.state.findMany()
  }
}
