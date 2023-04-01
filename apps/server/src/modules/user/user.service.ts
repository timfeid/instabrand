import { PrismaClient, User, Prisma } from '@instabrand/data'
import { Service } from 'typedi'
import { PasswordService } from '../password/password.service'

@Service()
export class UserService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly passwordService: PasswordService,
  ) {}

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        customer: {
          include: {
            address: {
              include: {
                state: true,
              },
            },
          },
        },
        brands: {
          include: {
            address: {
              include: {
                state: true,
              },
            },
          },
        },
      },
    })
  }

  async findOrCreate(email: string, data: { firstName: string; lastName: string }) {
    // const user = await this.prisma.user.upsert({
    //   where: {
    //     email: email.toLowerCase(),
    //   },
    //   create: {
    //     id: ulid(),
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     email: email.toLowerCase(),
    //   },
    //   update: {
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //   },
    // })
    // return await this.findById(user.id)
  }

  async create(user: Prisma.UserCreateInput) {
    if (user.password) {
      user.password = await this.passwordService.encrypt(user.password)
    }

    return this.prisma.user.create({
      data: user,
    })
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        customer: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      },
    })
  }

  async update(user: User, data: Prisma.UserUpdateInput) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data,
    })
  }
}
