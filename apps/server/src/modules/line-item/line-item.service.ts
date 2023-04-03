import { LineItem } from '@prisma/client'
import { Service } from 'typedi'
import { ulid } from 'ulidx'
import { SetCartItem } from '../cart/cart.schemas'
import { VariantService } from '../variant/variant.service'

@Service()
export class LineItemService {
  constructor(private readonly variantService: VariantService) {}
}
