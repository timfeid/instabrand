import { Address, Brand, Image, Product, State, Variant } from '@prisma/client'
import faker from 'faker'
import { ulid } from 'ulidx'
import { states } from '../prisma/data'

export function repeatFactory<T>(factory: (index: number) => T, times: number) {
  return [...Array(times)].map((v, i) => factory(i))
}

// export function userFactory(): User {
//   return {
//     firstName: faker.name.firstName(),
//     lastName: faker.name.lastName(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//     createdAt: new Date(),
//     deletedAt: null,
//     updatedAt: new Date(),
//     id: ulid(),
//   }
// }

export function brandFactory(): Brand {
  return {
    id: ulid(),
    name: faker.company.companyName(),
    logo: faker.image.business(250, 75),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    color: faker.commerce.color(),
    addressId: null,
    // website: faker.internet.domainName(),
  }
}

function abbrState(input: string) {
  input = input.toUpperCase()
  for (let i = 0; i < states.length; i++) {
    if (states[i][1] == input) {
      return states[i][0]
    }
  }
}

export function stateFactory(): State {
  const abbreviation = faker.address.stateAbbr()
  const name = abbrState(abbreviation)

  return {
    name,
    abbreviation,
    id: faker.datatype.number(),
  }
}

export function addressFactory(): Address {
  return {
    id: ulid(),
    line1: faker.address.streetName(),
    line2: null,
    line3: null,
    stateId: null,
    city: faker.address.city(),
    zip: faker.address.zipCode(),
  }
}

export function imageFactory(): Image {
  return {
    url: faker.image.imageUrl(960, 540),
    url2x: faker.image.imageUrl(1920, 1080),
    urlDesktop: faker.image.imageUrl(960, 540),
    urlDesktop2x: faker.image.imageUrl(1920, 1080),
    urlTablet: faker.image.imageUrl(672, 672),
    urlTablet2x: faker.image.imageUrl(672, 672),
    urlMobile: faker.image.imageUrl(672, 672),
    urlMobile2x: faker.image.imageUrl(672, 672),
  }
}

export function productFactory(brandId: string): Product {
  return {
    id: ulid(),
    name: faker.commerce.product(),
    description: faker.lorem.paragraph(),
    slug: faker.unique(faker.lorem.slug),
    brandId,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }
}

export function variantFactory(productId: string = null): Variant {
  return {
    id: ulid(),
    productId,
    slug: faker.unique(faker.lorem.slug),
    sku: null,
    size: null,
    color: null,
    material: null,
    style: null,
    priceInCents: 10000,
    compareAtPriceInCents: null,
    costInCents: 1000,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }
}
