<script lang="ts">
	import { theme } from "../../stores/brand";
	import type { Product } from "../../types";


  export let product: Product
  export let themeName: 'productCard' | 'productPage'
</script>

<div class={theme(`${themeName}.descriptionContainer`)}>
  {@html product.description}
</div>
