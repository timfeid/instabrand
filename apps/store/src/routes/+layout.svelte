<script>
	import { cart, cartTotalProducts } from "$lib/stores/cart";
  import "../app.css";
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="py-6 border-b">
  <div class="container mx-auto flex">
    <div class="ml-auto">
      cart {$cartTotalProducts}
    </div>
  </div>
</div>

<div class="container mx-auto py-4">

  <slot />
</div>
