import { Product as PrismaProduct, Variant } from '@instabrand/data'
import { Context } from 'koa'
import {
  Arg,
  Args,
  ArgsType,
  ArgumentValidationError,
  Ctx,
  Field,
  FieldResolver,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { Service } from 'typedi'
import { connectionFromRepository } from '../connection/connection.factory'
import { ImagePresenter } from '../image/image.presenter'
import { Image } from '../image/image.schema'
import { UrlService } from '../url/url.service'
import { VariantService } from '../variant/variant.service'
import { ProductConnection } from './product.connection'
import {
  FindProductArgs,
  Product,
  ProductArgs,
  ProductAvailability,
  ProductPrice,
  ProductResponse,
} from './product.schemas'
import { ProductReturnType, ProductService } from './product.service'

@ArgsType()
class GetProduct {
  @Field()
  slug: string

  @Field()
  brandId: string

  @Field({ nullable: true })
  variantSlug?: string
}

@Service()
@Resolver(ProductResponse)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly imagePresenter: ImagePresenter,
    private readonly variantService: VariantService,
  ) {}

  @Query(returns => ProductResponse)
  async product(@Ctx() ctx: Context, @Args() args: GetProduct) {
    const product = await this.productService.findBySlug(args.slug, args.brandId)
    const { types, variant } = await this.variantService.getVariant(
      args.variantSlug,
      ['size', 'color', 'material', 'style'],
      product.variants,
    )

    console.log(JSON.stringify(product.variants, null, 2))

    return {
      product,
      types,
      variant,
    }
  }
}
