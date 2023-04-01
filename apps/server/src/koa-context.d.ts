import { JwtPayload } from 'jsonwebtoken'
import { AccessTokenData } from './modules/jwt/jwt.types'

declare module 'koa' {
  interface BaseContext {
    accessTokenData: AccessTokenData | null
  }
}
