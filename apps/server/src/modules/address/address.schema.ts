import { ArgsType, Field, Float, InputType, ObjectType } from 'type-graphql'
import { State } from '../states/state.schema'

@ObjectType()
@InputType()
export class AddressBase {
  @Field()
  line1: string

  @Field({ nullable: true })
  line2?: string | null

  @Field({ nullable: true })
  line3?: string | null

  @Field({ nullable: true })
  building?: string

  @Field()
  city: string

  @Field()
  zip: string
}

@ObjectType()
export class AddressWithGeo extends AddressBase {
  @Field()
  id: string

  @Field(() => State)
  state: State

  @Field(() => Float)
  lng: number

  @Field(() => Float)
  lat: number

  // @Field()
  // description: string
}

@ObjectType()
export class Address extends AddressBase {
  @Field()
  id: string

  @Field(() => State)
  state: State

  @Field()
  description: string
}

@InputType()
export class AddressInput extends AddressBase {
  @Field()
  state: string

  @Field(() => Float)
  lng: number

  @Field(() => Float)
  lat: number
}
