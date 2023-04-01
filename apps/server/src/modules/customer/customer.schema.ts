import { Field, ObjectType } from 'type-graphql'
import { Address, AddressWithGeo } from '../address/address.schema'

@ObjectType()
export class CustomerBase {
  @Field()
  id: string

  @Field()
  phone: string

  @Field()
  name: string

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string
}

@ObjectType()
export class Customer extends CustomerBase {
  @Field(() => Address, { nullable: true })
  address: Address
}
