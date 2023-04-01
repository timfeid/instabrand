import { ObjectType } from 'type-graphql'
import { EdgeType } from '../connection/edge'
import { Product } from './product.schemas'

@ObjectType()
export class ProductEdge extends EdgeType(Product) {}
