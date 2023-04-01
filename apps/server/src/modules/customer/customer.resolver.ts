import { Context } from 'koa'
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { Service } from 'typedi'
import { Address } from '../address/address.schema'
import { AddressService } from '../address/address.service'
import { ConnectionArguments } from '../connection/connection.args'
import { connectionFromRepository } from '../connection/connection.factory'
import { CustomerConnection } from './customer.connection'
import { Customer } from './customer.schema'
import { CreateCustomer, CustomerService } from './customer.service'
import { User, Customer as PrismaCustomer } from '@instabrand/data'

@ArgsType()
export class CustomerArgs extends ConnectionArguments {
  brandId: string

  @Field({ nullable: true })
  search?: string
}

@Service()
@Resolver(Customer)
export class CustomerResolver {
  constructor(
    // private readonly invoiceService: InvoiceService,
    private readonly customerService: CustomerService,
    private readonly addressService: AddressService,
  ) {}

  @Query(() => CustomerConnection)
  async customers(@Ctx() ctx: Context, @Args() args: CustomerArgs) {
    return connectionFromRepository(args, this.customerService)
  }

  @Query(() => Customer, { nullable: true })
  async customer(
    @Ctx() ctx: Context,
    @Arg('id', { nullable: true }) id?: string,
    @Arg('email', { nullable: true }) email?: string,
  ) {
    if (!id && !email) {
      throw new Error('Please supply either id or email')
    }

    return await this.customerService.findOne({ id, email }, 'brandId')
  }

  // @FieldResolver(() => String)
  // name(@Root() root: PrismaCustomer & { user: User }) {
  //   return `${root.firstName} ${root.lastName}`
  // }

  // @FieldResolver(() => String)
  // firstName(@Root() root: PrismaCustomer & { user: User }) {
  //   return `${root.firstName}`
  // }

  // @FieldResolver(() => String)
  // lastName(@Root() root: PrismaCustomer & { user: User }) {
  //   return `${root.lastName}`
  // }

  // @FieldResolver(() => String)
  // email(@Root() root: PrismaCustomer & { user: User }) {
  //   return `${root.email}`
  // }

  // @FieldResolver(() => [Invoice])
  // async invoices(@Root() customer: Customer) {
  //   return await this.invoiceService.find({}, {customerId: customer.id, brandId: null})
  // }

  @FieldResolver(() => Address)
  address(@Root() customer: any) {
    if (!customer.addressId) {
      return null
    }

    if (customer.address) {
      return customer.address
    }

    return this.addressService.findOne(customer.addressId)
  }

  @Mutation(() => Customer)
  async createCustomer(@Ctx() ctx: Context, @Args() args: CreateCustomer) {
    return await this.customerService.create(args)
  }
}
