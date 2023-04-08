<script lang="ts">
	import type { Product } from "../../bindings";
	import { theme } from "../../stores/brand";

  export let product: Product
  export let themeName: 'productCard' | 'productPage'
</script>

<h2 class={theme(`${themeName}.name`)}>
  {product.name}
</h2>
