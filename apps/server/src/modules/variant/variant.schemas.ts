import { Field, Float, Int, ObjectType } from 'type-graphql'
import { Image } from '../image/image.schema'
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

  @Field(() => [Image])
  images: Image[]

  @Field(() => Image, { nullable: true })
  image?: Image

  @Field({ nullable: true })
  size: string

  @Field({ nullable: true })
  color: string

  @Field({ nullable: true })
  material: string

  @Field({ nullable: true })
  style: string
}
