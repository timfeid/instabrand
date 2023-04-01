import { Context } from 'koa'
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { OrderService } from '../order/order.service'
import { Cart } from './cart.schemas'

@Resolver(Cart)
@Service()
export class CartResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Cart)
  async setCart(@Ctx() ctx: Context, @Arg('data') data: string, @Arg('brandId') brandId: string) {
    // const { user } = ctx.user
    // if (!ctx.session.cart) {
    //   ctx.session.cart = {}
    // }
    // const cart = JSON.parse(data)
    // ctx.session.cart[brandId] = cart
    // if (cart.id) {
    //   console.log('for user?', user)
    //   await this.orderService.update({
    //     ...cart,
    //     invoiceId: cart.id,
    //     userId: user?.id,
    //     brandId,
    //   })
    // } else {
    //   const { id } = await this.orderService.create({
    //     ...cart,
    //     status: OrderStatus.cart,
    //     userId: user?.id,
    //     brandId,
    //   })
    //   ctx.session.cart[brandId].id = id
    // }
    // return await this.getCart(ctx, brandId)
  }

  @Query(() => Cart)
  async getCart(@Ctx() ctx: Context, @Arg('brandId') brandId: string) {
    const cart = ctx.session?.cart?.[brandId]

    if (!cart?.id) {
      return {
        order: null,
      }
    }

    return {
      // order: await this.orderService.findOne(cart.id),
    }
  }

  @FieldResolver()
  deliveryMethods(@Root() cart: Cart) {
    if (!cart.order) {
      return []
    }

    return [
      {
        name: 'pickup',
        disabled: false,
      },
      {
        name: 'delivery',
        disabled: false,
      },
    ]
  }
}
