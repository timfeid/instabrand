<script lang="ts">
	import { theme } from "../../stores/brand";
  import type { Product } from "../../../../../server/src/modules/product/product.schemas"

  export let product: Product
  export let themeName: 'productCard' | 'productPage'
</script>

<h2 class={theme(`${themeName}.name`)}>
  {product.name}
</h2>
