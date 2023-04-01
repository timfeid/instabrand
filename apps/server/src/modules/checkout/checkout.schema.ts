import { ArgsType, Field, Float, InputType, ObjectType } from 'type-graphql'
import { AddressInput } from '../address/address.schema'

@InputType()
export class CheckoutCustomer {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string

  @Field()
  phone: string
}

@InputType()
export class CheckoutInput {
  @Field()
  deliveryMethod: string

  @Field(() => CheckoutCustomer)
  customer: CheckoutCustomer

  @Field(() => AddressInput, { nullable: true })
  address?: AddressInput
}
