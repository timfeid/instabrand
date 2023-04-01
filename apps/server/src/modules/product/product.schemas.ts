import { FileUpload, GraphQLUpload } from 'graphql-upload'
import {
  ArgsType,
  createUnionType,
  Field,
  Float,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { Brand } from '../brand/brand.schemas'
import { ConnectionArguments } from '../connection/connection.args'
import { Image } from '../image/image.schema'
import { Variant } from '../variant/variant.schemas'

export enum ProductAvailability {
  InStock = 'InStock',
  Limited = 'Limited',
  SoldOut = 'SoldOut',
  PreOrder = 'PreOrder',
}

registerEnumType(ProductAvailability, {
  name: 'ProductAvailability',
})

@ObjectType()
export class ProductPrice {
  @Field()
  actual: string

  @Field({ nullable: true })
  compareAt?: string
}

@ObjectType()
export class Product {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  slug: string

  @Field()
  price: ProductPrice

  @Field()
  description: string

  @Field(() => Image, { nullable: true })
  primaryImage: Image

  @Field(() => Image, { nullable: true })
  secondaryImage: Image

  @Field(() => [Image])
  images: Image[]

  @Field(() => Brand)
  brand: Brand

  @Field(() => ProductAvailability)
  availability: ProductAvailability

  @Field({ nullable: true })
  label: string

  @Field(() => [Variant])
  variants: Variant[]

  // @Field({ nullable: true })
  // taxRate?: TaxRate
}

@ArgsType()
export class ProductArgs extends ConnectionArguments {
  @Field({ nullable: true })
  brandId?: string

  @Field({ nullable: true })
  search?: string
}

@ArgsType()
export class FindProductArgs {
  @Field()
  brandId: string

  @Field()
  slug: string
}

@ObjectType()
export class ProductListTypeVariant {
  @Field()
  value: string

  @Field()
  slug: string

  @Field()
  selected: boolean
}

@ObjectType()
export class ProductListType {
  @Field()
  name: string

  @Field(() => [ProductListTypeVariant])
  variants: ProductListTypeVariant[]
}

@ObjectType()
export class ProductResponse {
  @Field(() => Product)
  product: Product

  @Field(() => Variant)
  variant: Variant

  @Field(() => [ProductListType])
  types: ProductListType[]
}
