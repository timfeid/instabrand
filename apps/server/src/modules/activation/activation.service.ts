import PrismaClient from '@instabrand/data'
import { Service } from 'typedi'
import { EmailService } from '../email/email.service'
import { TokenService } from '../token/token.service'
import { ActivationMailable } from './activation.mailable'

@Service()
export class ActivationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async sendActivation(user: PrismaClient.User) {
    const token = await this.tokenService.createToken(user.id, 'activation')

    await this.emailService.sendEmail(new ActivationMailable(token), user)
  }
}
