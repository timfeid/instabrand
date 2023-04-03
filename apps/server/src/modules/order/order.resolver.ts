import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import Container, { Service } from 'typedi'
import { CustomerService } from '../customer/customer.service'
import { Order, PaymentIntent } from './order.schema'
import { OrderService, OrderServiceReturnType } from './order.service'

const formatter = Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' })

@Service()
@Resolver(Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
  ) {
    this.orderService = Container.get(OrderService)
  }

  @FieldResolver()
  subtotal(@Root() root: OrderServiceReturnType) {
    const subtotal = this.orderService.getSubtotal(root)
    const formatter = new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD',
    })

    return formatter.format(subtotal / 100)
  }

  @Mutation(() => PaymentIntent)
  async createPaymentIntent(@Arg('orderId') orderId: string): Promise<PaymentIntent> {
    const order = await this.orderService.findById(orderId)

    if (!order) {
      throw new Error('Unable to find order')
    }

    const intent = await this.orderService.createPaymentIntent(order)

    return {
      id: intent.id,
      secret: intent.client_secret,
    }
  }
}
