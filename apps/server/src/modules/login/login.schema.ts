import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class LoginResponse {
  @Field({ nullable: true })
  accessToken?: string

  @Field({ nullable: true })
  refreshToken?: string

  @Field()
  success: boolean

  @Field({ nullable: true })
  error?: string
}

@ObjectType()
export class LogoutResponse {
  @Field()
  success: boolean
}
