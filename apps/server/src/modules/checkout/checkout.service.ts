import { Customer, PrismaClient, OrderStatus } from '@instabrand/data'
import Stripe from 'stripe'
import { Service } from 'typedi'
import { CreateCustomer, CustomerService } from '../customer/customer.service'
import { OrderService } from '../order/order.service'
import { UserService } from '../user/user.service'
import { CheckoutInput } from './checkout.schema'

@Service()
export class CheckoutService {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly prisma: PrismaClient,
    private readonly stripe: Stripe,
  ) {}

  async checkout(stripePaymentIntentId: string, args: CheckoutInput) {
    const order = await this.orderService.findBy({ stripePaymentIntentId })
    if (!order) {
      throw new Error('Unable to find the order attached to this payment intent')
    }

    const intent = await this.stripe.paymentIntents.retrieve(stripePaymentIntentId)

    if (intent.status === 'succeeded') {
      console.log('succeeeeded')
    }

    const createData = {
      brandId: order.brandId,
      firstName: args.customer.firstName,
      lastName: args.customer.lastName,
      address: args.address,
      email: args.customer.email,
      phone: args.customer.phone,
    }
    const customer =
      (await this.customerService.findOne({ email: args.customer.email }, order.brandId)) ||
      (await this.customerService.create(createData))
    let stripeId = customer.stripeId

    if (!stripeId) {
      stripeId = await this.customerService.assignStripeCustomerId(customer)
    }

    await this.stripe.paymentIntents.update(intent.id, {
      customer: stripeId,
    })

    await this.orderService.updateOrder(order.id, {
      customerId: customer.id,
      status: OrderStatus.waiting_shipping,
    })
  }
}
