import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { CheckoutInput } from './checkout.schema'
import { CheckoutService } from './checkout.service'

@Service()
@Resolver()
export class CheckoutResolver {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Mutation(() => Boolean)
  async checkout(
    @Ctx() ctx,
    @Arg('data') data: CheckoutInput,
    @Arg('providerId') providerId: string,
  ) {
    const user = ctx.user
    if (ctx.session.cart && ctx.session.cart[providerId]) {
      await this.checkoutService.checkout(ctx.session.cart[providerId].id, data, user)

      ctx.session.cart[providerId] = undefined

      return true
    }

    return false
  }
}
