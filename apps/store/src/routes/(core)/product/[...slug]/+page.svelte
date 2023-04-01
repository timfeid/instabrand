<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { theme } from "$lib/stores/brand";
	import ProductName from '../../../../lib/components/product/ProductName.svelte';
	import ProductPrice from '../../../../lib/components/product/ProductPrice.svelte';
	import type { PageData } from "./$types";


  export let data: PageData

  let product = data.product
  let productData = {product, themeName: 'productPage' as 'productPage'}
  let variant = data.product.variant
  $: {
    product = data.product
    productData = {product, themeName: 'productPage' as 'productPage'}
  }
</script>


<div class={theme('productPage.container', 'flex flex-row-reverse')}>
  <div class={theme('productPage.infoContainer', 'w-1/2 space-y-4')}>
    <ProductName product={product.product} themeName="productPage" />
    <ProductPrice price={variant.price} themeName="productPage" />
    <div>
      {#each product.types as type}
        {type.name}
        <div class="flex space-x-2">
          {#each type.variants as variant}
            <a href="/product/{product.product.slug}/{variant.slug}" class="rounded border py-2 px-4" class:bg-brand-primary={variant.selected}> {variant.value}</a>
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <div class={theme('productPage.imageContainer', 'w-1/2')}>
    {#each data.product.product.images as image}
      <Image {image}></Image>
    {/each}
  </div>
</div>
