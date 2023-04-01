import { NonEmptyArray } from 'type-graphql'
import { AddressResolver } from './modules/address/address.resolver'
import { CartResolver } from './modules/cart/cart.resolver'
import { CheckoutResolver } from './modules/checkout/checkout.resolver'
import { CustomerResolver } from './modules/customer/customer.resolver'
import { LoginResolver } from './modules/login/login.resolver'
import { ProductResolver } from './modules/product/product.resolver'
import { ProductsResolver } from './modules/product/products.resolver'
import { RegisterResolver } from './modules/register/register.resolver'
import { StateResolver } from './modules/states/state.resolver'
import { UserResolver } from './modules/user/user.resolver'
import { VariantResolver } from './modules/variant/variant.resolver'

export const resolvers: NonEmptyArray<any> = [
  AddressResolver,
  RegisterResolver,
  LoginResolver,
  ProductsResolver,
  ProductResolver,
  CustomerResolver,
  VariantResolver,
  CartResolver,
  UserResolver,
  CheckoutResolver,
  StateResolver,
]
