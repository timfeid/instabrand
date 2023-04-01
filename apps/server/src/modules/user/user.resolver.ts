import { Context } from 'koa'
import { Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { JWTService } from '../jwt/jwt.service'
import { User } from './user.schema'
import { UserService } from './user.service'

@Service()
@Resolver(User)
export class UserResolver {
  constructor(private readonly jwtService: JWTService, private readonly userService: UserService) {}

  @Query(returns => User)
  async user(@Ctx() ctx: Context): Promise<User | null> {
    let jwt = this.jwtService.validate(ctx.session.auth)
    if (!jwt) {
      jwt = this.jwtService.fromHeader(ctx.req.headers.authorization)
    }

    if (jwt.sub) {
      // return await this.userService.findById(jwt.sub.toString())
    }

    return null
  }
}
