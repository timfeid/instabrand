import { FieldResolver, Resolver, Root } from 'type-graphql'
import Container, { Service } from 'typedi'
import { CustomerService } from '../customer/customer.service'
import { Order } from './order.schema'
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
}
