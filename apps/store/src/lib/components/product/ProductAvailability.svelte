<script lang="ts">
	import type { Product } from "../../bindings";
	import { theme } from "../../stores/brand";
	import { ProductAvailability } from "../../types";

  export let product: Product
  export let themeName: 'productCard' | 'productPage'

</script>

{#if product.availability === ProductAvailability.SoldOut}
  <div class={theme(`${themeName}.${product.availability}`, 'text-red-900')}>Sold Out</div>
{/if}
