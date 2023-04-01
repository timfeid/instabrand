import { Field, Float, Int, ObjectType } from 'type-graphql'
import { Order } from '../order/order.schema'

@ObjectType()
class DeliveryMethod {
  @Field()
  name: string

  @Field()
  disabled: boolean

  @Field({ nullable: true })
  disabledReason?: string
}

@ObjectType()
export class Cart {
  @Field(() => Order, { nullable: true })
  order: Order

  @Field(() => [DeliveryMethod])
  deliveryMethods: DeliveryMethod[]
}
