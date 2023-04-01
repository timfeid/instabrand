import { Field, Float, Int, ObjectType } from 'type-graphql'
import { Product, ProductPrice } from '../product/product.schemas'

@ObjectType()
export class Variant {
  @Field()
  id: string

  @Field(() => ProductPrice)
  price: ProductPrice

  @Field(() => Product)
  product: Product
}
