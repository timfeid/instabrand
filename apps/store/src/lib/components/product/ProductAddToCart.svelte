<script lang="ts">
	import { theme } from "../../stores/brand";
	import { cart, setCartProduct, type Cart } from "../../stores/cart";
  import type { Product } from "../../../../../server/src/modules/product/product.schemas"


  export let product: Product
  export let themeName: 'productCard' | 'productPage'


  let selectedVariant = product.variants[0]
  let lowestQuantity = 1
  let quantity = 1

  const changeQuantity = (val: number) => {
    console.log(quantity, val)
    quantity += val
    if (quantity < lowestQuantity) {
      quantity = lowestQuantity
    }

    console.log('final quantity', quantity)
  }

  const addItemToCart = () => {
    // console.log('adding', selectedPrice.id, 'with quantity', quantity)
    console.log(`${quantity === 0 ? 'Removed' : 'Added '+quantity} ${product.name} ${quantity === 0 ? 'from' : 'to'} your cart.`)
    setCartProduct(selectedVariant.id, quantity, selectedVariant.id)

    if (quantity === 0) {
      lowestQuantity = 1
      quantity = 1
    }
  }

  let inCart = false

  const updateInCart = (cart: Cart) => {
    const i: any = cart.products.find(i => product.variants.find((price: any) => price.id === i.priceId && i.priceId === selectedVariant.id))
    console.log(i)
    inCart = !!i
    if (inCart) {
      quantity = i.quantity
      lowestQuantity = 0
    }
  }

  const changeVariant = (variant: any) => {
    selectedVariant = variant
    lowestQuantity = 1
    updateInCart($cart)
  }

  cart.subscribe(updateInCart)

</script>

<form on:submit|preventDefault={addItemToCart}>

  <div class={theme(`${themeName}.addToCart.quantityLabel`, 'text-sm')}>

  {#if product.availability !== 'SoldOut'}
    <div class={theme(`${themeName}.addToCart.quantityLabel`, 'text-sm')}>
      Quantity
    </div>

    <div class={theme(`${themeName}.addToCart.quantityButtonContainer`, 'flex py-2')}>
      <div>{quantity}</div>
      <button type="button" class={theme(`${themeName}.addToCart.quantityButton`, 'px-2')} on:click={() => changeQuantity(-1)}>-</button>
      <button type="button" class={theme(`${themeName}.addToCart.quantityButton`, 'px-2')} on:click={() => changeQuantity(1)}>+</button>
    </div>
  {/if}

  <button class={theme(`${themeName}.addToCard.button`, 'disabled:bg-gray-200 bg-brand-primary uppercase py-2 px-4 tracking-wide mt-4')} disabled={product.availability === 'SoldOut'}>
    {product.availability === 'SoldOut' ? 'Sold Out' : 'Add to Cart'}
  </button>

  <div class={theme(`${themeName}.addToCart.shippingDateContainer`, 'uppercase mt-4')}>
    Ships on
    <span class={theme(`${themeName}.addToCart.shippingDate`)}>
      2024
    </span>
  </div>
</form>
