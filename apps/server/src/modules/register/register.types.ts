import { ArgsType, Field, InputType, ObjectType } from 'type-graphql'

@InputType()
export class RegistrationInput {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string

  @Field()
  password: string
}

@ObjectType()
export class RegisterResponse {
  @Field()
  success: boolean

  @Field({ nullable: true })
  error?: string
}
