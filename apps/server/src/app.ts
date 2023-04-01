import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import cors from '@koa/cors'
import Koa from 'koa'
import koaBody from 'koa-bodyparser'
import { createApolloServer } from './apollo-server'
import session from 'koa-session'
import { ApolloServer } from 'apollo-server-koa'
import Container from 'typedi'
import { PrismaClient } from '@instabrand/data'
import { JWTService } from './modules/jwt/jwt.service'
import mail from '@sendgrid/mail'
import { graphqlUploadKoa } from 'graphql-upload'
import { S3Client } from '@aws-sdk/client-s3'
import * as redis from 'redis'
import { ConfigService } from './modules/config/config.service'
import Stripe from 'stripe'
import { Axios } from 'axios'

const redisClient = redis.createClient({
  url: Container.get(ConfigService).redisUrl,
})

Container.set(
  PrismaClient,
  new PrismaClient({
    // log: ['query', 'info', 'warn', 'error'],
  }),
)
Container.set(Axios, new Axios({}))
Container.set(S3Client, new S3Client({ region: 'eu-west-1' }))
Container.set('redis', redisClient)
Container.set(
  Stripe,
  new Stripe(Container.get(ConfigService).stripeKey, { apiVersion: '2022-11-15' }),
)
mail.setApiKey(process.env.SENDGRID_API_KEY)

const app = new Koa()

app.keys = ['something kool']

const domain = process.env.BASE_DOMAIN === 'localhost' ? 'localhost' : `.${process.env.BASE_DOMAIN}`

app.use((context, next) => {
  if (context.request.headers.origin?.includes(process.env.BASE_DOMAIN)) {
    return session(
      {
        domain,
      },
      app,
    )(context, next)
  }

  return session({}, app)(context, next)
})

app.use(koaBody())
app.use(
  cors({
    credentials: true,
  }),
)

app.use(function (ctx, next) {
  ctx.accessTokenData = Container.get(JWTService).fromContext(ctx)

  return next()
})

createApolloServer().then(async (server: ApolloServer) => {
  await Promise.all([redisClient.connect(), server.start()])

  server.applyMiddleware({ app, cors: false })

  app.emit('ready')
})

app.on('error', e => console.log(e))
app.onerror = e => {
  console.log(e)
}

export { app }
