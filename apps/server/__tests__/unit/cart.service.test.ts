import { OrderStatus } from '@prisma/client'
import Container from 'typedi'
import { SetCartArgs } from '../../src/modules/cart/cart.schemas'
import { CartService } from '../../src/modules/cart/cart.service'
import { OrderService } from '../../src/modules/order/order.service'

describe('cart functions', () => {
  it('adds to an empty cart', async () => {
    const payload: SetCartArgs = {
      brandId: 'brand-id',
      items: [
        {
          variantId: 'green-lg',
          quantity: 1,
        },
      ],
    }

    const orderService = Container.get(OrderService)
    const mock = jest.spyOn(orderService, 'createOrder').mockResolvedValue(null)

    await Container.get(CartService).setCart(payload)

    expect(mock).toBeCalledWith({
      ...payload,
      status: OrderStatus.cart,
    })
  })

  it('adds to an non-empty cart', async () => {
    const payload: SetCartArgs = {
      id: 'cart-1',
      brandId: 'brand-id',
      items: [
        {
          variantId: 'green-lg',
          quantity: 1,
        },
      ],
    }

    const orderService = Container.get(OrderService)
    const mock = jest.spyOn(orderService, 'updateOrder').mockResolvedValue(null)

    await Container.get(CartService).setCart(payload)

    expect(mock).toBeCalledWith(payload.id, {
      ...payload,
      status: OrderStatus.cart,
    })
  })
})
