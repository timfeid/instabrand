import { ObjectType } from 'type-graphql'
import { ConnectionType } from '../connection/connection.generic'
import { OrderEdge } from './order.edge'

@ObjectType()
export class OrderConnection extends ConnectionType(OrderEdge) {}
