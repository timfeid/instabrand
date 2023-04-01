import { Context } from 'koa'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { LoginResponse, LogoutResponse } from './login.schema'
import { LoginService } from './login.service'

@Service()
@Resolver(LoginResponse)
export class LoginResolver {
  constructor(private readonly loginService: LoginService) {}

  @Mutation(returns => LoginResponse)
  async login(
    @Ctx() ctx: Context,
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<LoginResponse> {
    const authTokens = await this.loginService.loginWithUsernameAndPassword(email, password)

    if (!authTokens) {
      return {
        success: false,
        error: 'Invalid email or password.',
      }
    }

    return this.loginSuccessResponse(ctx, authTokens)
  }

  @Mutation(returns => LoginResponse)
  async refreshToken(@Ctx() ctx) {
    const authTokens = await this.loginService.refreshToken(ctx.session.refreshToken)

    if (!authTokens) {
      return {
        success: false,
        error: 'Invalid refresh token',
      }
    }

    return this.loginSuccessResponse(ctx, authTokens)
  }

  loginSuccessResponse(ctx: Context, tokenData: { refreshToken: string; accessToken: string }) {
    const { refreshToken, accessToken } = tokenData

    ctx.session.refreshToken = refreshToken
    ctx.session.accessToken = accessToken

    return {
      success: true,
      refreshToken,
      accessToken,
    }
  }

  @Mutation(returns => LogoutResponse)
  async logout(@Ctx() ctx: Context): Promise<LogoutResponse> {
    ctx.session.auth = null

    return {
      success: true,
    }
  }
}
