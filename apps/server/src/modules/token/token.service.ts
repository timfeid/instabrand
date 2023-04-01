import { PrismaClient } from '@instabrand/data'
import faker from 'faker'
import { Service } from 'typedi'

@Service()
export class TokenService {
  constructor(private readonly prisma: PrismaClient) {}
  async createToken(userId: string, type: string) {
    const token = faker.datatype.uuid()

    return await this.prisma.token.create({
      data: {
        userId,
        token,
        type,
      },
    })
  }
}
