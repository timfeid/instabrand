import { ObjectType } from 'type-graphql'
import { EdgeType } from '../connection/edge'
import { Order } from './order.schema'

@ObjectType()
export class OrderEdge extends EdgeType(Order) {}
