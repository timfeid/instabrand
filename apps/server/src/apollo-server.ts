import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-koa'
import { ContextFunction, ApolloServerBase } from 'apollo-server-core'
import { buildSchema } from 'type-graphql'
// import { pubSub } from './pubsub'
import { resolvers } from './resolvers'
import Container from 'typedi'

const getContext = ({ ctx }) => {
  if (!ctx) {
    ctx = {}
  }
  if (!ctx.session) {
    ctx.session = {}
  }
  return ctx
}

export async function createApolloServer(
  contextGrabber?: (ctx) => object | ContextFunction<any, object>,
) {
  const time = new Date().getTime()
  const schema = await buildSchema({
    resolvers,
    container: Container,
    // pubSub,
  })
  const server = new ApolloServer({
    schema,
    context: contextGrabber ? ctx => contextGrabber(ctx) : getContext,
  })
  console.log('Set up took', new Date().getTime() - time)

  return server
}
