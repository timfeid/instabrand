import 'reflect-metadata'
import { PrismaClient } from '.prisma/client'
import { createApolloServer } from '../src/apollo-server'
import { ApolloServerBase } from 'apollo-server-core'

let testClient: ApolloServerBase
export const prisma = new PrismaClient()

export const defaultContextGrabber = ({ ctx }) => {
  if (!ctx) {
    ctx = {}
  }
  if (!ctx.session) {
    ctx.session = {}
  }
  return ctx
}

export const defaultContext = { session: {} } as any

class ClientDetails {
  context = defaultContextGrabber

  grabContext = ctx => {
    return this.context(ctx)
  }
}

export const clientDetails = new ClientDetails()

export async function getTestClient() {
  if (!testClient) {
    testClient = await createApolloServer()
  }

  return testClient
}

export { testClient }
