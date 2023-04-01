import { Address, PrismaClient } from '@prisma/client'
import faker from 'faker'

export async function createAddress(prisma: PrismaClient, address: Address) {
  const lat = parseFloat(faker.address.latitude())
  const lng = parseFloat(faker.address.longitude())

  await prisma.$executeRaw`
    insert into addresses (id, line1, state_id, city, zip, geom)
    values (${address.id}, ${address.line1}, ${faker.datatype.number({ min: 1, max: 50 })}, ${
    address.city
  }, ${address.zip}, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326))
  `

  return address
}
