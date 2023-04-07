import { PrismaClient } from '@instabrand/data'
import { ulid } from 'ulidx'
import { addressFactory, brandFactory } from '../__tests__/factories'
import faker from 'faker'

const prisma = new PrismaClient()

export const states = [
  ['Arizona', 'AZ'],
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
]
async function main() {
  await Promise.all([
    ...states.map(async state => {
      await prisma.state.upsert({
        where: {
          abbreviation: state[1],
        },
        update: {},
        create: {
          name: state[0],
          abbreviation: state[1],
        },
      })
    }),
  ])

  const address = addressFactory()
  const lat = parseFloat(faker.address.latitude())
  const lng = parseFloat(faker.address.longitude())
  await prisma.$executeRaw`
    insert into addresses (id, line1, state_id, city, zip, geom)
    values (${address.id}, ${address.line1}, ${faker.datatype.number({ min: 1, max: 50 })}, ${
    address.city
  }, ${address.zip}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))
  `

  const brandId = '01GWT4W42WH4FFERNG1APADG6Z'
  await prisma.brand.upsert({
    where: {
      id: brandId,
    },
    create: {
      ...brandFactory(),
      id: brandId,
      addressId: address.id,
    },
    update: {},
  })

  ///// creating the hat

  const product = await prisma.product.upsert({
    where: {
      brandId_slug: {
        brandId,
        slug: 'hat',
      },
    },
    create: {
      id: ulid(),
      name: 'Cars Are Pain Vegan Suede Hat',
      description: 'This is a descriptive description',
      slug: 'hat',
      brandId,
    },
    update: {},
  })

  await prisma.image.upsert({
    where: {
      url: '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_344x.png?v=1678995316',
    },
    create: {
      url: '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_344x.png?v=1678995316',
      url2x:
        '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_688x.png?v=1678995316 2x',
      urlDesktop:
        '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_429x.png?v=1678995316',
      urlDesktop2x:
        '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_858x.png?v=1678995316',
      urlTablet:
        '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_376x.png?v=1678995316',
      urlTablet2x:
        '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_752x.png?v=1678995316 2x',
      urlMobile:
        '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_344x.png?v=1678995316',
      urlMobile2x:
        '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_688x.png?v=1678995316 2x',
    },
    update: {},
  })

  await prisma.imageProduct.upsert({
    where: {
      url_productId: {
        url: '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_344x.png?v=1678995316',
        productId: product.id,
      },
    },
    update: {},
    create: {
      url: '//cdn.shopify.com/s/files/1/0095/0196/6441/products/cap_green_fl1_344x.png?v=1678995316',
      productId: product.id,
    },
  })

  const inventoryLocationId = ulid()
  await prisma.inventoryLocation.create({
    data: {
      id: inventoryLocationId,
      name: 'Store location',
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'hat',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: product.id,
      slug: 'hat',
      priceInCents: 2000,
      costInCents: 1000,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 100,
          available: 100, // this will have to be updated on ever order?
        },
      },
    },
  })

  ///// creating the t shirt

  const tshirtProduct = await prisma.product.upsert({
    where: {
      brandId_slug: {
        brandId,
        slug: 't-shirt',
      },
    },
    create: {
      id: ulid(),
      name: 'Big Buff Horse T-Shirt - Black',
      description: 'This is a descriptive description',
      slug: 't-shirt',
      brandId,
    },
    update: {},
  })

  await prisma.image.upsert({
    where: {
      url: '//cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_344x.png?v=1677796940',
    },
    create: {
      url: '//cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_344x.png?v=1677796940',
      url2x:
        'https://cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_688x.png?v=1677796940',
      urlDesktop:
        'https://cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_429x.png?v=1677796940',
      urlDesktop2x:
        'https://cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_858x.png?v=1677796940',
      urlTablet:
        'https://cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_376x.png?v=1677796940',
      urlTablet2x:
        'https://cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_752x.png?v=1677796940',
      urlMobile:
        'https://cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_429x.png?v=1677796940',
      urlMobile2x:
        'https://cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_858x.png?v=1677796940',
    },
    update: {},
  })

  await prisma.imageProduct.upsert({
    where: {
      url_productId: {
        url: '//cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_344x.png?v=1677796940',
        productId: tshirtProduct.id,
      },
    },
    update: {},
    create: {
      url: '//cdn.shopify.com/s/files/1/0095/0196/6441/products/BBBH_pepper_frton_344x.png?v=1677796940',
      productId: tshirtProduct.id,
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'green-sm',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'green-sm',
      size: 'S',
      color: 'Green',
      priceInCents: 2998,
      costInCents: 1000,
      compareAtPriceInCents: 3998,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 100,
          available: 100, // this will have to be updated on ever order?
        },
      },
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'green-md',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'green-md',
      size: 'M',
      color: 'Green',
      priceInCents: 2998,
      costInCents: 1000,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 100,
          available: 100, // this will have to be updated on ever order?
        },
      },
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'green-lg',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'green-lg',
      size: 'L',
      color: 'Green',
      priceInCents: 2998,
      costInCents: 1000,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 0,
          available: 0, // this will have to be updated on ever order?
        },
      },
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'green-xl',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'green-xl',
      size: 'XL',
      color: 'Green',
      priceInCents: 2998,
      costInCents: 1000,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 0,
          available: 0, // this will have to be updated on ever order?
        },
      },
    },
  })

  /// black

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'black-sm',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'black-sm',
      size: 'S',
      color: 'Black',
      priceInCents: 2998,
      costInCents: 1000,
      compareAtPriceInCents: 3998,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 100,
          available: 100, // this will have to be updated on ever order?
        },
      },
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'black-md',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'black-md',
      size: 'M',
      color: 'Black',
      priceInCents: 2998,
      costInCents: 1000,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 100,
          available: 100, // this will have to be updated on ever order?
        },
      },
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'black-lg',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'black-lg',
      size: 'L',
      color: 'Black',
      priceInCents: 2998,
      costInCents: 1000,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 0,
          available: 0, // this will have to be updated on ever order?
        },
      },
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'black-xl',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'black-xl',
      size: 'XL',
      color: 'Black',
      priceInCents: 2998,
      costInCents: 1000,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 0,
          available: 0, // this will have to be updated on ever order?
        },
      },
    },
  })

  await prisma.variant.upsert({
    where: {
      slug_productId: {
        slug: 'black-2xl',
        productId: product.id,
      },
    },
    update: {},
    create: {
      id: ulid(),
      productId: tshirtProduct.id,
      slug: 'black-2xl',
      size: '2X',
      color: 'Black',
      priceInCents: 2998,
      costInCents: 1000,
      inventories: {
        create: {
          inventoryLocationId,
          onHand: 0,
          available: 0, // this will have to be updated on ever order?
        },
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
