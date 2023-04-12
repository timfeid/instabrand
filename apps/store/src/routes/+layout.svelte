<script lang="ts">
	import { cart, cartTotalProducts, defaultCart } from '$lib/stores/cart';
	import Cart from '$lib/icons/ui/Cart.svg?component';
	import '../app.css';
	import type { PageData } from './$types';

	export let data: PageData;

	if (!$cart || !$cart.id) {
    console.log(JSON.stringify(data, null, 2))
		cart.set(
			data.cart
				? {
						line_items: data.cart.line_items.map(item => ({variant: {id: item.variant_id}, quantity: item.quantity})),
						id: data.cart.id,
            sync: false,
				  }
				: { ...defaultCart },
		);
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="border-b">
	<div class="container mx-auto flex h-20 items-center justify-between">
		<div>left</div>
		<a href="/cart" class="flex relative h-12 items-center">
			<div
				class="absolute top-0 -left-8 text-[10px] bg-brand-primary px-[8px] leading-[22px] rounded-full"
			>
				{$cartTotalProducts}
			</div>
			<Cart class="mr-2" width="32" height="32" />
		</a>
	</div>
</div>

<div class="container mx-auto py-4">
	<slot />
</div>
