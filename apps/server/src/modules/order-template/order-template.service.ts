import 'reflect-metadata'
import { Address, City, State } from '@instabrand/data'
import cuid from 'cuid'
import Container, { Service } from 'typedi'
import { AddressInput } from '../../schema/address'
import { Order, OrderTemplate, OrderStatus } from '@instabrand/data'

@Service()
export class OrderTemplateService {
  findForOrder(order: Order & { template: OrderTemplate; status: OrderStatus }): OrderTemplate {
    if (order.template) {
      return order.template
    }

    return {
      id: 1,
      name: order.statusId,
      providerId: order.providerId,
      type: order.status.type,
      displayName: order.status.type.substr(0, 1).toUpperCase() + order.status.type.substr(1),
      showPhoneNumber: true,
      showAddress: true,
      showEmail: true,
      showWebsite: true,
    }
  }
}
