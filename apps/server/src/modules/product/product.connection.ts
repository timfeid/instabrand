import { ObjectType } from 'type-graphql'
import { ConnectionType } from '../connection/connection.generic'
import { ProductEdge } from './product.edge'

@ObjectType()
export class ProductConnection extends ConnectionType(ProductEdge) {}
