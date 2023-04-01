import { ObjectType } from 'type-graphql'
import { EdgeType } from '../connection/edge'
import { Customer } from './customer.schema'

@ObjectType()
export class CustomerEdge extends EdgeType(Customer) {}
