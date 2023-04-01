<script lang="ts">
	import { theme } from "../../stores/brand";
  import type { Product } from "../../../../../server/src/modules/product/product.schemas"


  export let product: Product
  export let themeName: 'productCard' | 'productPage'
</script>

{#if product.label}
  <div class={theme(`${themeName}.labelContainer`, "absolute bottom-0 left-0 right-0")}>
    <div class={theme(`${themeName}.label`)}>{product.label}</div>
  </div>
{/if}
