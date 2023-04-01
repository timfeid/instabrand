import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class State {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  abbreviation: string
}
