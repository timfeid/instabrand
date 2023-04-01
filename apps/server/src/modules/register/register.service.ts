import { PrismaClient } from '@instabrand/data'
import { Service } from 'typedi'
import { ulid } from 'ulidx'
import { PasswordService } from '../password/password.service'
import { RegistrationInput } from './register.types'

@Service()
export class RegisterService {
  constructor(
    // private readonly activationService: ActivationService,
    private readonly passwordService: PasswordService,
    private readonly prisma: PrismaClient,
  ) {}

  async register(data: RegistrationInput) {
    const user = await this.createUser(data)
    // await this.activationService.sendActivation(user)
  }

  async createUser(data: RegistrationInput) {
    return await this.prisma.user.create({
      data: {
        id: ulid(),
        ...data,
        password: await this.passwordService.encrypt(data.password),
      },
    })
  }
}
