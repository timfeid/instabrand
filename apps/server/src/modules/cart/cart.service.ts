import { Order, PrismaClient, OrderStatus } from '@instabrand/data'
import { Service } from 'typedi'
import { ulid } from 'ulidx'

type CartProduct = {
  priceId: string
  quantity: number
}

type CreateCartArgs = {
  brandId: string
  userId: string | null
  products: CartProduct[]
}

@Service()
export class CartService {
  constructor(private readonly prisma: PrismaClient) {}

  async getCart(id: string) {
    return await this.prisma.order.findFirst({
      where: {
        id,
      },
      include: {
        customer: {
          include: {
            address: {
              include: {
                state: true,
              },
            },
          },
        },
        orderProducts: {
          include: {
            price: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })
  }

  async createCart(args: CreateCartArgs) {
    console.log('creating cart!')
    const prettyId = await this.prisma.order.count({
      where: {
        brandId: args.brandId,
      },
    })

    const order = await this.prisma.order.create({
      data: {
        id: ulid(),
        prettyId,
        statusId: OrderStatus.cart,
        userId: args.userId,
        brandId: args.brandId,
      },
    })

    await this.syncProducts(order, args.products)

    return this.getCart(order.id)
  }

  async updateCart(id: string, args: CreateCartArgs) {
    console.log('updating cart', id)
    const order = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        userId: args.userId,
      },
    })

    await this.syncProducts(order, args.products)
    return this.getCart(order.id)
  }

  async syncProducts(order: Order, products: CartProduct[]) {
    await this.prisma.orderProduct.deleteMany({
      where: {
        orderId: order.id,
      },
    })
    await this.prisma.orderProduct.createMany({
      data: products.map(product => {
        return {
          id: ulid(),
          orderId: order.id,
          quantity: product.quantity,
          priceId: product.priceId,
        }
      }),
    })
  }
}
