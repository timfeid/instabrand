import { ArgsType, Field, ObjectType } from 'type-graphql'
import { Address } from '../address/address.schema'

@ObjectType()
export class Brand {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  logo: string

  @Field()
  color: string

  @Field(() => Address)
  address: Address

  acceptsDelivery: boolean
  acceptsPickup: boolean
  minPriceInCentsForDelivery: number
  minPriceInCentsForPickup: number
}

@ArgsType()
export class FindBrandArgs {
  @Field()
  domainName: string
}
