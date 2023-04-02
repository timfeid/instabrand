<script>
	import { cartTotalProducts } from "$lib/stores/cart";
  import Cart from '$lib/icons/ui/Cart.svg?component'
  import "../app.css";
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500&display=swap" rel="stylesheet">
</svelte:head>

<div class="border-b">
  <div class="container mx-auto flex h-20 items-center justify-between">
    <div>left</div>
    <a href="/cart" class="flex relative h-12 items-center">
      <div class="absolute top-0 -left-8 text-[10px] bg-brand-primary px-[8px] leading-[22px] rounded-full">{$cartTotalProducts}</div>
      <Cart class="mr-2" width="32" height="32" />
    </a>
  </div>
</div>

<div class="container mx-auto py-4">

  <slot />
</div>
