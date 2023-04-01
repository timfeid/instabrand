import { Field, Float, Int, ObjectType } from 'type-graphql'
import { Product, ProductAvailability, ProductPrice } from '../product/product.schemas'

@ObjectType()
export class Variant {
  @Field()
  id: string

  @Field()
  slug: string

  @Field(() => ProductPrice)
  price: ProductPrice

  @Field(() => ProductAvailability)
  availability: ProductAvailability

  @Field(() => Product)
  product: Product
}
