<script lang="ts">
	import type { PageData } from "./$types";
  import ProductCard from "$lib/components/ProductCard.svelte";
	import { getProducts } from "../../../lib/queries/products";


  export let data: PageData

  let products = data.products.products
  let pageInfo = data.products.pageInfo
  let loading = false
  // let variables

  $: {
    products = data.products.products
    pageInfo = data.products.pageInfo
  }

  function setData(response: {products: any[], pageInfo: any}) {
    products = response.products
    pageInfo = response.pageInfo
  }

  async function getMore() {
    setData(await getProducts({after: pageInfo.after}))
  }


</script>

  <div class="grid grid-cols-4 grid-gap-8">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </div>
