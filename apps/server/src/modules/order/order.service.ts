import {
  Image,
  ImageProduct,
  LineItem,
  Order,
  OrderStatus,
  Prisma,
  PrismaClient,
  Product,
  Variant,
} from '@prisma/client'
import Stripe from 'stripe'
import { Service } from 'typedi'
import { ulid } from 'ulidx'

type OrderDetailsItem = {
  variantId: string
  quantity: number
}

export type UpdateOrderDetails = {
  status?: OrderStatus
  lineItems?: OrderDetailsItem[]
  customerId?: string
}

export type OrderDetails = {
  brandId: string
  status: OrderStatus
  lineItems: OrderDetailsItem[]
  customerId?: string
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
  constructor(private readonly prisma: PrismaClient, private readonly stripe: Stripe) {}

  async findBy(where: Prisma.OrderWhereInput) {
    return await this.prisma.order.findFirst({
      where,
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

  async findById(orderId: string): Promise<OrderServiceReturnType> {
    return await this.findBy({ id: orderId })
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

  async updateOrder(id: string, orderDetails: UpdateOrderDetails) {
    const order = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: orderDetails.status,
        customerId: orderDetails.customerId,
      },
    })

    if (orderDetails.lineItems) {
      await this.syncLineItems(order.id, orderDetails.lineItems)
    }

    return await this.findById(order.id)
  }

  async createOrder(orderDetails: OrderDetails) {
    const order = await this.prisma.order.create({
      data: {
        id: ulid(),
        prettyId: await this.getPrettyId(orderDetails.brandId),
        status: orderDetails.status,
        brandId: orderDetails.brandId,
        customerId: orderDetails.customerId,
      },
    })

    await this.syncLineItems(order.id, orderDetails.lineItems)

    return await this.findById(order.id)
  }

  private async updatePaymentIntent(order: OrderServiceReturnType) {
    const paymentIntent = await this.stripe.paymentIntents.update(order.stripePaymentIntentId, {
      amount: this.getSubtotal(order),
      currency: 'usd',
    })

    return paymentIntent
  }

  async createPaymentIntent(order: OrderServiceReturnType) {
    if (order.stripePaymentIntentId) {
      return this.updatePaymentIntent(order)
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: this.getSubtotal(order),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    await this.prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        stripePaymentIntentId: paymentIntent.id,
      },
    })

    return paymentIntent
  }

  getSubtotal(order: OrderServiceReturnType) {
    return order.lineItems.reduce(
      (total, lineItem) => (total += lineItem.variant.priceInCents * lineItem.quantity),
      0,
    )
  }
}
