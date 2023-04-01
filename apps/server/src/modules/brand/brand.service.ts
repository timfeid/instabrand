import { PrismaClient } from '@instabrand/data'
import { Service } from 'typedi'

@Service()
export class BrandService {
  constructor(private readonly prisma: PrismaClient) {}

  async findByDomainName(domainName: string) {
    const baseDomain = process.env.BASE_DOMAIN
    const isSubDomain = domainName.endsWith(baseDomain)
    domainName = isSubDomain
      ? domainName.substring(0, domainName.length - baseDomain.length - 1)
      : domainName

    console.log('domain stuff', domainName, isSubDomain)

    return await this.prisma.brand.findFirst({
      where: {
        domainName,
        isSubDomain,
      },
      include: {
        address: {
          include: {
            state: true,
          },
        },
      },
    })
  }
}
