import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Order {
  @Field()
  id: string
}
