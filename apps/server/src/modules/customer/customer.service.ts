import { CustomerArgs } from './customer.resolver'
import { ArgsType, Field } from 'type-graphql'
import { Service } from 'typedi'
import { PrismaClient, Prisma, Address, State, User, Customer } from '@instabrand/data'
import { ulid } from 'ulidx'
import { AddressService } from '../address/address.service'
import { Repository, RepositoryFindOptions } from '../connection/repository'
import { AddressInput } from '../address/address.schema'
import Stripe from 'stripe'

@ArgsType()
export class CreateCustomer {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field(() => AddressInput)
  address: AddressInput

  @Field()
  email: string

  @Field()
  phone: string

  userId?: string
  brandId: string
}

type CustomerServiceReturnType = Customer & {
  user?: User
  address?: Address & {
    state: State
  }
}

@Service()
export class CustomerService implements Repository<CustomerServiceReturnType, CustomerArgs> {
  constructor(
    private readonly addressService: AddressService,
    private readonly prisma: PrismaClient,
    private readonly stripe: Stripe,
  ) {}

  async assignStripeCustomerId(customer: CustomerServiceReturnType) {
    const stripeId = await this.createStripeId({
      ...customer,
      address: {
        ...customer.address,
        state: customer.address.state.name,
      },
    })

    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        stripeId,
      },
    })

    return stripeId
  }

  private async createStripeId(data: CreateCustomer) {
    const { id } = await this.stripe.customers.create({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      address: {
        city: data.address.city,
        country: 'US',
        line1: data.address.line1,
        line2: data.address.line2,
        postal_code: data.address.zip,
        state: data.address.state,
      },
    })

    return id
  }

  async find({ skip, take }: RepositoryFindOptions, args: CustomerArgs) {
    return await this.prisma.customer.findMany({
      include: {
        user: true,
        address: {
          include: {
            state: true,
          },
        },
      },
      where: this.wheres(args),
      ...(skip ? { skip } : {}),
      ...(take ? { take } : {}),
    })
  }

  async findOne(
    { id, email, userId }: { id?: string; email?: string; userId?: string },
    brandId: string,
  ): Promise<CustomerServiceReturnType> {
    let where: any = id ? { id } : { email: { mode: 'insensitive', equals: email } }
    if (userId) {
      where = { user: { id: userId } }
    }

    const customer = await this.prisma.customer.findFirst({
      include: {
        address: {
          include: {
            state: true,
          },
        },
      },
      where: {
        brandId,
        ...where,
      },
    })

    if (customer) {
      return customer
    }

    return null
  }

  async count(args?: CustomerArgs) {
    return await this.prisma.customer.count({
      where: this.wheres(args),
    })
  }

  wheres(args?: CustomerArgs) {
    const wheres: Prisma.CustomerWhereInput = {}

    if (args) {
      if (args.brandId) {
        wheres.brandId = args.brandId
      }
      if (args.search) {
        wheres.OR = [
          {
            firstName: {
              contains: args.search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: args.search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: args.search,
              mode: 'insensitive',
            },
          },
        ]
      }
    }

    return wheres
  }

  async create(data: CreateCustomer) {
    let address: Address & { state: State }
    if (data.address) {
      console.log('address provided', data.address)
      address = await this.addressService.create(data.address)
    }

    const customer = await this.prisma.customer.create({
      data: {
        id: ulid(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        userId: data.userId,
        brandId: data.brandId,
        addressId: address?.id,
        stripeId: await this.createStripeId(data),
      },
    })

    return {
      ...customer,
      address,
    }
  }
}
