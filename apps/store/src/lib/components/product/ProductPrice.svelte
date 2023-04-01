<script lang="ts">
	import { theme } from "../../stores/brand";
  import type { ProductPrice } from "../../../../../server/src/modules/product/product.schemas"


  export let price: ProductPrice
  export let themeName: 'productCard' | 'productPage'
</script>

<div class={theme(`${themeName}.priceContainer`)}>
  <span class={theme(`${themeName}.priceActual`)}>{price.actual}</span>
  {#if price.compareAt}
    <span class={theme(`${themeName}.priceCompareAt`, 'line-through text-gray-500')}
      >{price.compareAt}</span
    >
  {/if}
</div>
