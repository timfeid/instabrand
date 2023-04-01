import { PrismaClient, User } from '@instabrand/data'
import { Context } from 'koa'
import { Service } from 'typedi'
import { JWTService } from '../jwt/jwt.service'
import { PasswordService } from '../password/password.service'
import { UserService } from '../user/user.service'

@Service()
export class LoginService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JWTService,
    private readonly passwordService: PasswordService,
  ) {}

  async loginWithUsernameAndPassword(email: string, password: string) {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      return false
    }

    if (!password || !(await this.passwordService.check(password, user.password))) {
      return false
    }

    return await this.createAuthTokens(user)
  }

  async createAuthTokens(user: User | false) {
    if (!user) {
      return false
    }

    return {
      refreshToken: this.jwtService.createRefreshToken(user),
      accessToken: await this.jwtService.createAccessToken(user),
    }
  }

  async refreshToken(refreshToken: string) {
    const validated = this.jwtService.validate(refreshToken)

    if (validated) {
      const user = await this.userService.findById(validated.sub)
      return this.createAuthTokens(user)
    }
  }
}
