import { ArgsType, Field, Float, ObjectType, registerEnumType } from 'type-graphql'

@ObjectType()
export class User {
  @Field({ nullable: true })
  email?: string

  @Field()
  username: string
}
