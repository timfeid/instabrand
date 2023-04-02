import { Context } from 'koa'
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { OrderService } from '../order/order.service'
import { Cart, SetCartArgs } from './cart.schemas'
import { CartService } from './cart.service'

@Resolver(Cart)
@Service()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Mutation(() => Cart)
  async setCart(@Ctx() ctx: Context, @Args() args: SetCartArgs) {
    return {
      order: await this.cartService.setCart(args),
    }
  }

  @Query(() => Cart)
  async getCart(@Ctx() ctx: Context, @Arg('brandId') brandId: string) {
    // return this.cartService.getCart()
  }
}
