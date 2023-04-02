import { OrderStatus, PrismaClient } from '@prisma/client'
import { Service } from 'typedi'
import { ulid } from 'ulidx'
import { LineItemService } from '../line-item/line-item.service'
import { OrderDetails, OrderService } from '../order/order.service'
import { SetCartArgs } from './cart.schemas'

@Service()
export class CartService {
  constructor(
    private readonly orderService: OrderService,
    private readonly prisma: PrismaClient,
    private readonly lineItemService: LineItemService,
  ) {}

  protected toCreateOrder(cart: SetCartArgs): OrderDetails {
    return { ...cart, status: OrderStatus.cart }
  }

  async setCart(cart: SetCartArgs) {
    if (cart.id) {
      return await this.orderService.updateOrder(cart.id, this.toCreateOrder(cart))
    }

    return await this.orderService.createOrder(this.toCreateOrder(cart))
  }
}
