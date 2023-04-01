import { Product as PrismaProduct, Variant } from '@instabrand/data'
import { Context } from 'koa'
import {
  Arg,
  Args,
  ArgumentValidationError,
  Ctx,
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
import { ProductConnection } from './product.connection'
import {
  FindProductArgs,
  Product,
  ProductArgs,
  ProductAvailability,
  ProductPrice,
} from './product.schemas'
import { ProductReturnType, ProductService } from './product.service'

@Service()
@Resolver(Product)
export class ProductsResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly imagePresenter: ImagePresenter,
  ) {}

  @Query(returns => ProductConnection)
  async products(@Ctx() ctx: Context, @Args() args: ProductArgs) {
    if (!args.brandId) {
      throw new ArgumentValidationError([
        { property: 'brandId', constraints: { nullable: 'Provider ID must be provided' } },
      ])
    }

    return connectionFromRepository(args, this.productService)
  }

  @Query(returns => Product)
  async productByID(@Arg('id') id: string) {
    return await this.productService.findByID(id)
  }

  @FieldResolver(() => String)
  price(@Root() root: PrismaProduct & { variants: Variant[] }): ProductPrice {
    if (root.variants.length > 0) {
      // const price = root.prices.sort((a,b) => a.priceInCents > b.priceInCents ? 1 : -1)[0]
      const variant = root.variants[0]

      return {
        actual: `$${(variant.priceInCents / 100).toFixed(2)}`,
        compareAt: variant.compareAtPriceInCents
          ? `$${(variant.compareAtPriceInCents / 100).toFixed(2)}`
          : null,
      }
    }
  }

  @FieldResolver()
  primaryImage(@Root() root: ProductReturnType): Image {
    const image = root.images.at(0)?.image

    if (image) {
      return this.imagePresenter.present(image, `${root.name} 1`)
    }
  }

  @FieldResolver()
  secondaryImage(@Root() root: ProductReturnType): Image {
    const image = root.images.at(1)?.image

    if (image) {
      return this.imagePresenter.present(image, `${root.name} 2`)
    }
  }

  @FieldResolver()
  images(@Root() root: ProductReturnType): Image[] {
    return root.images.map((im, index) =>
      this.imagePresenter.present(im.image, `${root.name} ${index}`),
    )
  }

  @FieldResolver()
  availability(@Root() root: ProductReturnType) {
    // const totalAvailable = root.variants.reduce((variant, total) => total+=variant.inventories.)

    let total = 0
    let allowedToOversell = false
    for (let i = 0; i < root.variants.length; ++i) {
      if (root.variants[i]) {
        for (let j = 0; j < root.variants[i].inventories.length; ++j) {
          total += root.variants[i].inventories[j].available
          if (root.variants[i].inventories[j].isAllowedToOversell) {
            allowedToOversell = true
          }
        }
      }
    }

    if (total === 0 && !allowedToOversell) {
      return ProductAvailability.SoldOut
    } else if (total <= 5) {
      return ProductAvailability.Limited
    }

    return ProductAvailability.InStock
  }

  @FieldResolver()
  label() {
    return 'test'
  }
}
