import { Customer, PrismaClient, OrderStatus } from '@instabrand/data'
import { Service } from 'typedi'
import { CustomerService } from '../customer/customer.service'
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
  ) {}

  async checkout(orderId: string, data: CheckoutInput, customer: Customer) {}
}
