<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { theme } from "$lib/stores/brand";
	import ProductName from '$lib/components/product/ProductName.svelte';
	import ProductPrice from '$lib/components/product/ProductPrice.svelte';
	import ProductAddToCart from '$lib/components/product/ProductAddToCart.svelte';
	import type { PageData } from "./$types";
	import ProductQuantity from '../../../../lib/components/product/ProductQuantity.svelte';

  export let data: PageData

  let product = data.product
  let variant = data.product.variant
  let quantity = 0
  $: {
    product = data.product
    variant = data.product.variant
  }
</script>

<div class={theme('productPage.container', 'flex flex-row-reverse')}>
  <div class={theme('productPage.infoContainer', 'w-1/2 space-y-4')}>
    <ProductName product={product.product} themeName="productPage" />
    <ProductPrice price={variant.price} themeName="productPage" />
    <div class="space-y-4">
      {#each product.types as type}
        <div>
          <div class={theme(`productPage.addToCart.label`)}>
            {type.name}
          </div>
          <div class="flex space-x-2">
            {#each type.variants as variant}
              <a href="/product/{product.product.slug}/{variant.slug}" class="rounded border py-2 px-4" class:bg-brand-primary={variant.selected} class:border-0={variant.selected}> {variant.value}</a>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <ProductQuantity themeName="productPage" bind:quantity={quantity} bind:variant={variant} />
    <ProductAddToCart quantity={quantity} themeName="productPage" bind:variant={variant} />

    <div class="pt-4">
      {@html product.product.description}
    </div>
  </div>
  <div class={theme('productPage.imageContainer', 'w-1/2')}>
    {#each data.product.product.images as image}
      <Image {image}></Image>
    {/each}
  </div>
</div>
