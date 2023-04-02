import { ArgsType, Field, Float, InputType, Int, ObjectType } from 'type-graphql'
import { Order } from '../order/order.schema'

@ObjectType()
export class Cart {
  @Field(() => Order, { nullable: true })
  order: Order
}

@InputType()
export class SetCartItem {
  @Field()
  variantId: string

  @Field(() => Int)
  quantity: number
}

@ArgsType()
export class SetCartArgs {
  @Field({ nullable: true })
  id?: string

  @Field(() => [SetCartItem], { nullable: 'items' })
  lineItems: SetCartItem[]

  @Field()
  brandId: string
}
