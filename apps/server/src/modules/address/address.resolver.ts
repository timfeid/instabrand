import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { Service } from 'typedi'
import { Address, AddressWithGeo } from './address.schema'
import { AddressService } from './address.service'

@Service()
@Resolver(Address)
export class AddressResolver {
  @FieldResolver()
  description(@Root() address) {
    return `${address.line1}, ${this.city(address)} ${this.state(address).abbreviation}`
  }

  @FieldResolver(() => String)
  city(@Root() address) {
    if (typeof address.city === 'string') {
      return address.city
    }

    return address.city.name
  }

  @FieldResolver()
  state(@Root() address) {
    if (address.state) {
      return address.state
    }

    return address.city.state
  }
}
