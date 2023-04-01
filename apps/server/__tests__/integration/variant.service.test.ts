import { PrismaClient, Product } from '@prisma/client'
import Container from 'typedi'
import { VariantService } from '../../src/modules/variant/variant.service'
import { addressFactory, brandFactory, productFactory, variantFactory } from '../factories'
import { createAddress } from '../helpers'

describe('products', () => {
  const prisma = Container.get(PrismaClient)
  const brand = brandFactory()
  const address = addressFactory()
  let product: Product

  beforeAll(async () => {
    await prisma.$queryRaw`truncate brands cascade;`
    await createAddress(prisma, address)
    await prisma.brand.create({
      data: {
        ...brand,
        addressId: address.id,
      },
    })
    product = await prisma.product.create({
      data: productFactory(brand.id),
    })
  })

  it('product can have two variants', async () => {
    const variant2X = await prisma.variant.create({
      data: {
        ...variantFactory(product.id),
        size: '2X',
      },
    })

    const variantL = await prisma.variant.create({
      data: {
        ...variantFactory(product.id),
        size: 'L',
      },
    })

    const response = await Container.get(VariantService).getDefaultVariant([variant2X, variantL])

    console.log(response)
  })
})
