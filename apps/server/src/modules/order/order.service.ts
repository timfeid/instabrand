import {
  Image,
  ImageProduct,
  LineItem,
  Order,
  OrderStatus,
  PrismaClient,
  Product,
  Variant,
} from '@prisma/client'
import { Service } from 'typedi'
import { ulid } from 'ulidx'

type OrderDetailsItem = {
  variantId: string
  quantity: number
}

export type OrderDetails = {
  brandId: string
  status: OrderStatus
  lineItems: OrderDetailsItem[]
}

export type OrderServiceReturnType = Order & {
  lineItems: (LineItem & {
    variant: Variant & {
      product: Product & {
        images: (ImageProduct & {
          image: Image
        })[]
      }
    }
  })[]
}

@Service()
export class OrderService {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(orderId: string): Promise<OrderServiceReturnType> {
    return await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        lineItems: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: {
                      include: {
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  async getPrettyId(brandId: string) {
    const total = await this.prisma.order.count({
      where: {
        brandId,
      },
    })

    return total + 1
  }

  async syncLineItems(id: string, items: OrderDetailsItem[]) {
    await this.prisma.lineItem.deleteMany({
      where: {
        orderId: id,
      },
    })

    await this.prisma.lineItem.createMany({
      data: items.map(item => {
        return { ...item, id: ulid(), orderId: id }
      }),
    })
  }

  async updateOrder(id: string, orderDetails: OrderDetails) {
    const order = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: orderDetails.status,
        brandId: orderDetails.brandId,
      },
    })

    await this.syncLineItems(order.id, orderDetails.lineItems)

    return await this.findById(order.id)
  }

  async createOrder(orderDetails: OrderDetails) {
    const order = await this.prisma.order.create({
      data: {
        id: ulid(),
        prettyId: await this.getPrettyId(orderDetails.brandId),
        status: orderDetails.status,
        brandId: orderDetails.brandId,
      },
    })

    await this.syncLineItems(order.id, orderDetails.lineItems)

    return await this.findById(order.id)
  }

  getSubtotal(order: OrderServiceReturnType) {
    return order.lineItems.reduce(
      (total, lineItem) => (total += lineItem.variant.priceInCents * lineItem.quantity),
      0,
    )
  }
}
