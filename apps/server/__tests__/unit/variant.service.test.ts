import { Variant } from '@prisma/client'
import Container from 'typedi'
import { VariantService } from '../../src/modules/variant/variant.service'
import { variantFactory } from '../factories'

describe('variants', () => {
  const shirtXLBlack: Variant = {
    ...variantFactory(),
    id: 'shirtXLBlack',
    slug: 'shirtXLBlack',
    size: 'XL',
    color: 'Black',
  }

  const shirtLGBlack: Variant = {
    ...variantFactory(),
    id: 'shirtLGBlack',
    slug: 'shirtLGBlack',
    size: 'LG',
    color: 'Black',
  }

  const shirtMDBlack: Variant = {
    ...variantFactory(),
    id: 'shirtMDBlack',
    slug: 'shirtMDBlack',
    size: 'MD',
    color: 'Black',
  }

  const shirtXLGreen: Variant = {
    ...variantFactory(),
    id: 'shirtXLGreen',
    slug: 'shirtXLGreen',
    size: 'XL',
    color: 'Green',
  }

  const shirtLGGreen: Variant = {
    ...variantFactory(),
    id: 'shirtLGGreen',
    slug: 'shirtLGGreen',
    size: 'LG',
    color: 'Green',
  }

  const shirtMDGreen: Variant = {
    ...variantFactory(),
    id: 'shirtMDGreen',
    slug: 'shirtMDGreen',
    size: 'MD',
    color: 'Green',
  }

  it('gets the types with their valid variants 0', async () => {
    const shirtXL = { ...shirtXLBlack, color: null }
    const response = await Container.get(VariantService).getVariantWithTypes(
      shirtXLBlack.slug,
      ['size', 'color', 'material', 'style'],
      [shirtXL, { ...shirtMDBlack, color: null }, { ...shirtLGBlack, color: null }],
    )

    console.log(JSON.stringify(response, null, 2))

    expect(response).toStrictEqual({
      variant: shirtXL,
      types: [
        {
          name: 'size',
          variants: [
            {
              id: shirtXL.id,
              slug: shirtXL.slug,
              value: 'XL',
              selected: true,
            },
            {
              id: shirtMDBlack.id,
              slug: shirtMDBlack.slug,
              value: 'MD',
              selected: false,
            },
            {
              id: shirtLGBlack.id,
              slug: shirtLGBlack.slug,
              value: 'LG',
              selected: false,
            },
          ],
        },
      ],
    })
  })

  it('gets the types with their valid variants 1', async () => {
    const response = await Container.get(VariantService).getVariantWithTypes(
      shirtXLBlack.slug,
      ['size', 'color', 'material', 'style'],
      [shirtXLBlack, shirtMDBlack, shirtLGBlack, shirtXLGreen, shirtMDGreen, shirtLGGreen],
    )

    console.log(JSON.stringify(response, null, 2))

    expect(response).toStrictEqual({
      variant: shirtXLBlack,
      types: [
        {
          name: 'size',
          variants: [
            {
              id: shirtXLBlack.id,
              slug: shirtXLBlack.slug,
              value: 'XL',
              selected: true,
            },
            {
              id: shirtMDBlack.id,
              slug: shirtMDBlack.slug,
              value: 'MD',
              selected: false,
            },
            {
              id: shirtLGBlack.id,
              slug: shirtLGBlack.slug,
              value: 'LG',
              selected: false,
            },
          ],
        },
        {
          name: 'color',
          variants: [
            {
              id: shirtXLBlack.id,
              slug: shirtXLBlack.slug,
              value: 'Black',
              selected: true,
            },

            {
              id: shirtXLGreen.id,
              slug: shirtXLGreen.slug,
              value: 'Green',
              selected: false,
            },
          ],
        },
      ],
    })
  })

  it('gets the types with their valid variants 2', async () => {
    const response = await Container.get(VariantService).getVariantWithTypes(
      shirtMDGreen.slug,
      ['size', 'color', 'material', 'style'],
      [shirtXLBlack, shirtMDBlack, shirtLGBlack, shirtXLGreen, shirtMDGreen, shirtLGGreen],
    )

    console.log(JSON.stringify(response, null, 2))

    expect(response).toStrictEqual({
      variant: shirtMDGreen,
      types: [
        {
          name: 'size',
          variants: [
            {
              id: shirtXLGreen.id,
              slug: shirtXLGreen.slug,
              value: 'XL',
              selected: false,
            },
            {
              id: shirtMDGreen.id,
              slug: shirtMDGreen.slug,
              selected: true,
              value: 'MD',
            },
            {
              id: shirtLGGreen.id,
              slug: shirtLGGreen.slug,
              value: 'LG',
              selected: false,
            },
          ],
        },
        {
          name: 'color',
          variants: [
            {
              id: shirtMDBlack.id,
              slug: shirtMDBlack.slug,
              value: 'Black',
              selected: false,
            },
            {
              id: shirtMDGreen.id,
              slug: shirtMDGreen.slug,
              value: 'Green',
              selected: true,
            },
          ],
        },
      ],
    })
  })

  it('gets the types with their valid variants 3', async () => {
    const shirtXLBlackCotton = {
      ...shirtXLBlack,
      id: 'shirtXLBlackCotton',
      slug: 'shirtXLBlackCotton',
      material: 'Cotton',
    }
    const shirtMDBlackCotton = {
      ...shirtMDBlack,
      id: 'shirtMDBlackCotton',
      slug: 'shirtMDBlackCotton',
      material: 'Cotton',
    }
    const shirtLGBlackCotton = {
      ...shirtLGBlack,
      id: 'shirtLGBlackCotton',
      slug: 'shirtLGBlackCotton',
      material: 'Cotton',
    }
    const shirtXLGreenCotton = {
      ...shirtXLGreen,
      id: 'shirtXLGreenCotton',
      slug: 'shirtXLGreenCotton',
      material: 'Cotton',
    }
    const shirtMDGreenCotton = {
      ...shirtMDGreen,
      id: 'shirtMDGreenCotton',
      slug: 'shirtMDGreenCotton',
      material: 'Cotton',
    }
    const shirtLGGreenCotton = {
      ...shirtLGGreen,
      id: 'shirtLGGreenCotton',
      slug: 'shirtLGGreenCotton',
      material: 'Cotton',
    }
    const shirtXLBlackWool = {
      ...shirtXLBlack,
      id: 'shirtXLBlackWool',
      slug: 'shirtXLBlackWool',
      material: 'Wool',
    }
    const shirtMDBlackWool = {
      ...shirtMDBlack,
      id: 'shirtMDBlackWool',
      slug: 'shirtMDBlackWool',
      material: 'Wool',
    }
    const shirtLGBlackWool = {
      ...shirtLGBlack,
      id: 'shirtLGBlackWool',
      slug: 'shirtLGBlackWool',
      material: 'Wool',
    }
    const shirtXLGreenWool = {
      ...shirtXLGreen,
      id: 'shirtXLGreenWool',
      slug: 'shirtXLGreenWool',
      material: 'Wool',
    }
    const shirtMDGreenWool = {
      ...shirtMDGreen,
      id: 'shirtMDGreenWool',
      slug: 'shirtMDGreenWool',
      material: 'Wool',
    }
    const shirtLGGreenWool = {
      ...shirtLGGreen,
      id: 'shirtLGGreenWool',
      slug: 'shirtLGGreenWool',
      material: 'Wool',
    }

    const response = await Container.get(VariantService).getVariantWithTypes(
      shirtLGBlackWool.slug,
      ['color', 'size', 'material', 'style'],
      [
        shirtXLBlackCotton,
        shirtMDBlackCotton,
        shirtLGBlackCotton,
        shirtXLGreenCotton,
        shirtMDGreenCotton,
        shirtLGGreenCotton,
        shirtXLBlackWool,
        shirtMDBlackWool,
        shirtLGBlackWool,
        shirtXLGreenWool,
        shirtMDGreenWool,
        shirtLGGreenWool,
      ],
    )

    console.log(JSON.stringify(response, null, 2))

    expect(response).toStrictEqual({
      variant: shirtLGBlackWool,
      types: [
        {
          name: 'color',
          variants: [
            {
              id: shirtLGBlackWool.id,
              slug: shirtLGBlackWool.slug,
              value: 'Black',
              selected: true,
            },
            {
              id: shirtLGGreenWool.id,
              slug: shirtLGGreenWool.slug,
              value: 'Green',
              selected: false,
            },
          ],
        },
        {
          name: 'size',
          variants: [
            {
              id: shirtXLBlackWool.id,
              slug: shirtXLBlackWool.slug,
              value: 'XL',
              selected: false,
            },
            {
              id: shirtMDBlackWool.id,
              slug: shirtMDBlackWool.slug,
              selected: false,
              value: 'MD',
            },
            {
              id: shirtLGBlackWool.id,
              slug: shirtLGBlackWool.slug,
              value: 'LG',
              selected: true,
            },
          ],
        },
        {
          name: 'material',
          variants: [
            {
              id: shirtLGBlackCotton.id,
              slug: shirtLGBlackCotton.slug,
              selected: false,
              value: 'Cotton',
            },
            {
              id: shirtLGBlackWool.id,
              slug: shirtLGBlackWool.slug,
              value: 'Wool',
              selected: true,
            },
          ],
        },
      ],
    })
  })
})
