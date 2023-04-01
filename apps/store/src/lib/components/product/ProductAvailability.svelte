<script lang="ts">
	import { theme } from "../../stores/brand";
	import { ProductAvailability } from "../../types";
  import type { Product } from "../../../../../server/src/modules/product/product.schemas"

  export let product: Product
  export let themeName: 'productCard' | 'productPage'
</script>

{#if product.availability === ProductAvailability.SoldOut}
  <div class={theme(`${themeName}.${product.availability}`, 'text-red-900')}>Sold Out</div>
{/if}
