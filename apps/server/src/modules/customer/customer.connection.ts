import { ObjectType } from 'type-graphql'
import { ConnectionType } from '../connection/connection.generic'
import { CustomerEdge } from './customer.edge'

@ObjectType()
export class CustomerConnection extends ConnectionType(CustomerEdge) {}
