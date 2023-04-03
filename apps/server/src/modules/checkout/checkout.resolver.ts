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
    @Arg('paymentIntentId') paymentIntentId: string,
  ) {
    const user = ctx.user
    await this.checkoutService.checkout(paymentIntentId, data)
  }
}
