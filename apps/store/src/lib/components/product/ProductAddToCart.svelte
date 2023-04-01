<script lang="ts">
	import { theme } from "../../stores/brand";
	import { cart, setCartProduct, type Cart } from "../../stores/cart";
	import type { Variant } from "../../../../../server/src/modules/variant/variant.schemas";
	import { get } from "svelte/store";


  export let variant: Variant
  export let themeName: 'productCard' | 'productPage'


  let currentVariant = variant
  let lowestQuantity = 1
  let quantity = 1

  const changeQuantity = (val: number) => {
    quantity = val + quantity
    if (quantity < lowestQuantity) {
      quantity = lowestQuantity
    }
  }

  const addItemToCart = () => {
    setCartProduct(variant.slug, quantity, variant.slug)

    if (quantity === 0) {
      lowestQuantity = 1
      quantity = 1
    }
  }

  let inCart = false

  // const updateInCart = (cart: Cart) => {
  //   const i: any = cart.products.find(i => {
  //     console.log(variant.slug, i.variantSlug)
  //     return variant.slug === i.variantSlug
  //   })

  //   inCart = !!i
  //   if (inCart) {
  //     quantity = i.quantity
  //     lowestQuantity = 0
  //   }

  //   return inCart
  // }

  // cart.subscribe(updateInCart)

  $: {
    currentVariant = variant
    console.log({currentVariant})
    const i: any = $cart.products.find(i => {
      console.log(currentVariant.slug, i.variantSlug)
      return currentVariant.slug === i.variantSlug
    })

    inCart = !!i
    if (inCart) {
      quantity = i.quantity
      lowestQuantity = 0
    }
  }
</script>

<form on:submit|preventDefault={addItemToCart}>

  <div class={theme(`${themeName}.addToCart.quantityLabel`, 'text-sm')}>

  {#if variant.availability !== 'SoldOut'}
    <div class={theme(`${themeName}.addToCart.quantityLabel`, 'text-sm')}>
      Quantity
    </div>

    <div class={theme(`${themeName}.addToCart.quantityButtonContainer`, 'flex py-2')}>
      <div>{quantity}</div>
      <button type="button" class={theme(`${themeName}.addToCart.quantityButton`, 'px-2')} on:click={() => changeQuantity(-1)}>-</button>
      <button type="button" class={theme(`${themeName}.addToCart.quantityButton`, 'px-2')} on:click={() => changeQuantity(1)}>+</button>
    </div>
  {/if}

  <button class={theme(`${themeName}.addToCard.button`, 'disabled:bg-gray-200 bg-brand-primary uppercase py-2 px-4 tracking-wide mt-4')} disabled={variant.availability === 'SoldOut'}>
    {variant.availability === 'SoldOut' ? 'Sold Out' : (inCart ? 'Update cart' : 'Add to Cart')}
  </button>

  {#if inCart && variant.availability !== 'SoldOut'}
    <a href="/checkout" class="border border-brand-primary uppercase py-2 px-4 tracking-wide ml-2">
      Check Out
    </a>
  {/if}

  <div class={theme(`${themeName}.addToCart.shippingDateContainer`, 'uppercase mt-4')}>
    Ships on
    <span class={theme(`${themeName}.addToCart.shippingDate`)}>
      2024
    </span>
  </div>
</form>
