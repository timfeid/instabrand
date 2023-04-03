import { Field, Int, ObjectType } from 'type-graphql'
import { Variant } from '../variant/variant.schemas'

@ObjectType()
export class LineItem {
  @Field(() => Variant)
  variant: Variant

  @Field(() => Int)
  quantity: number
}
