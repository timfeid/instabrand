import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { Variant as PrismaVariant } from '@instabrand/data'
import { Context } from 'koa'
import { Variant } from './variant.schemas'
import { VariantService } from './variant.service'
import { ProductPrice } from '../product/product.schemas'

const intl = Intl.NumberFormat('us')

@Resolver(Variant)
@Service()
export class VariantResolver {
  constructor(private readonly variantService: VariantService) {}

  @Query(() => [Variant])
  async variants(@Arg('ids', () => [String]) ids: string[]) {
    return await this.variantService.getVariants(ids)
  }

  @Query(() => [Variant])
  async cart(@Ctx() ctx: Context) {
    const items = []

    if (ctx.session.cart) {
      ctx.session.cart.items.forEach(item => {
        items.push(item.variantId)
      })
    }

    return await this.variantService.getVariants(items)
  }

  @FieldResolver()
  price(@Root() root: PrismaVariant): ProductPrice {
    return {
      actual: `$${(root.priceInCents / 100).toFixed(2)}`,
      compareAt: '$24.00',
    }
  }
}
