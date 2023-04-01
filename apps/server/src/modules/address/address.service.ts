import { Address, PrismaClient, State } from '@instabrand/data'
import { Service } from 'typedi'
import { ulid } from 'ulidx'
import { AddressInput } from './address.schema'

@Service()
export class AddressService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: AddressInput) {
    const state = await this.prisma.state.findFirst({
      where: {
        OR: [
          {
            name: data.state,
          },
          {
            abbreviation: data.state,
          },
        ],
      },
    })

    const id = ulid()

    await this.prisma.$queryRaw`
      insert into addresses (id, line1, line2, line3, city, state_id, zip, geom)

      values (
        ${id},
        ${data.line1},
        ${data.line2 ? data.line2 : null},
        ${data.line3 ? data.line3 : null},
        ${data.city},
        ${state.id},
        ${data.zip},
        ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326)
      )
    `

    const address = await this.prisma.address.findUnique({
      where: { id },
      include: {
        state: true,
      },
    })

    return {
      ...address,
      lat: data.lat,
      lng: data.lng,
    }
  }

  async findGeo(id: string) {
    // @ts-ignore
    const [{ geor }] = await this.prisma
      .$queryRaw`select ST_AsGeoJSON(geo) as geor from addresses where id = ${id}`
    const geo = JSON.parse(geor)

    return {
      lat: geo.coordinates[1],
      lng: geo.coordinates[0],
    }
  }

  async findOne(id: string) {
    const address = await this.prisma.address.findUnique({
      where: { id },
      include: {
        state: true,
      },
    })

    return address
  }
}
