import { PrismaClient, Variant } from '@instabrand/data'
import { Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { ProductListType } from '../product/product.schemas'

interface TypeVariant {
  id: string
  [key: string]: any
  selected?: boolean
}

@Service()
export class VariantService {
  constructor(private readonly prisma: PrismaClient) {}

  async getVariants(ids: string[]) {
    return this.prisma.variant.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        product: {
          include: {
            brand: true,
            images: true,
          },
        },
      },
    })
  }

  async getVariant(id: string) {
    return await this.prisma.variant.findFirst({ where: { id } })
  }

  async getVariantWithTypes(
    selectedVariantSlug: string | null,
    typeNames: string[],
    allVariants: Variant[],
  ) {
    if (!selectedVariantSlug) {
      selectedVariantSlug = allVariants[0].id
    }
    const selectedVariant = allVariants.find(variant => variant.slug === selectedVariantSlug)

    if (!selectedVariant) {
      return this.getVariantWithTypes(allVariants[0].slug, typeNames, allVariants)
    }

    const filterByType = (variant: Variant, filterTypes: string[], currentType: string) =>
      filterTypes.every(type => type === currentType || variant[type] === selectedVariant[type])

    const types: ProductListType[] = typeNames
      .map(typeName => {
        const filterTypes = typeNames.filter(type => type !== typeName)
        const variants = allVariants
          .filter(variant => filterByType(variant, filterTypes, typeName))
          .map(variant => ({
            id: variant.id,
            value: variant[typeName],
            slug: variant.slug,
            selected: variant.slug === selectedVariantSlug,
          }))
          .filter(variant => variant.value !== null && variant.value !== undefined) // filter out variants with no value for typeName
          .reduce((uniqueVariants, currentVariant) => {
            // Remove duplicates by checking if a variant with the same property value already exists in the array
            const isDuplicate = uniqueVariants.some(
              uniqueVariant => uniqueVariant.value === currentVariant.value,
            )
            if (!isDuplicate) {
              uniqueVariants.push(currentVariant)
            }
            return uniqueVariants
          }, [])

        return {
          name: typeName,
          variants,
        }
      })
      .filter(type => type.variants.length > 0)

    return {
      variant: selectedVariant,
      types,
    }
  }
}
