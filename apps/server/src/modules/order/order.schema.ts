import { Field, ObjectType } from 'type-graphql'
import { LineItem } from '../line-item/line-item.schema'

@ObjectType()
export class Order {
  @Field()
  id: string

  @Field(() => [LineItem])
  lineItems: LineItem[]

  @Field()
  subtotal: string
}

@ObjectType()
export class PaymentIntent {
  @Field()
  id: string

  @Field()
  secret: string
}
