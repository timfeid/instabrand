import { S3Client } from '@aws-sdk/client-s3'
import {
  Image,
  Prisma,
  PrismaClient,
  Product,
  ImageProduct,
  Variant,
  Inventory,
} from '@instabrand/data'
import { Service } from 'typedi'
import { Repository, RepositoryFindOptions } from '../connection/repository'
import { ProductArgs } from './product.schemas'

export type ProductReturnType = Product & {
  images: (ImageProduct & {
    image: Image
  })[]
  variants: (Variant & {
    inventories: Inventory[]
  })[]
}

@Service()
export class ProductService implements Repository<Product, ProductArgs> {
  constructor(private readonly prisma: PrismaClient, private readonly s3: S3Client) {}

  async findBySlug(slug: string, brandId: string): Promise<ProductReturnType> {
    return await this.prisma.product.findFirst({
      where: {
        ...this.wheres(),
        brandId,
        slug,
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
        variants: {
          include: {
            inventories: true,
          },
          where: {
            deletedAt: null,
          },
          orderBy: [],
        },
        brand: true,
      },
    })
  }

  async findByID(id: string): Promise<ProductReturnType> {
    return await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
        variants: {
          include: {
            inventories: true,
          },
          where: {
            deletedAt: null,
          },
          orderBy: [],
        },
        brand: true,
      },
    })
  }

  async find(options: RepositoryFindOptions, args: ProductArgs): Promise<ProductReturnType[]> {
    return await this.prisma.product.findMany({
      where: {
        ...this.wheres(args),
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
        variants: {
          include: {
            inventories: true,
          },
          where: {
            deletedAt: null,
          },
          orderBy: [],
        },
        brand: true,
      },
    })
  }

  async count(args: ProductArgs) {
    return await this.prisma.product.count({
      where: {
        ...this.wheres(args),
      },
    })
  }

  wheres(args?: ProductArgs) {
    const wheres: Prisma.ProductWhereInput = {
      deletedAt: null,
      variants: {
        some: {
          priceInCents: {
            gte: 0,
          },
        },
      },
    }

    if (args) {
      if (args.brandId) {
        wheres.brandId = args.brandId
      }
      if (args.search) {
        wheres.name = {
          contains: args.search,
          mode: 'insensitive',
        }
      }
    }

    return wheres
  }
}
