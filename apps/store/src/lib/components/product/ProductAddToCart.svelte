<script lang="ts">
	import { theme } from '../../stores/brand';
	import { cart, setCartProduct } from '../../stores/cart';
	import Checkout from '$lib/icons/ui/Checkout.svg?component';
	import ProductQuantity from './ProductQuantity.svelte';
	import type { Variant } from '../../bindings';

	export let variant: Variant;
	export let quantity: number = 1;
	export let themeName: 'productCard' | 'productPage';

	let currentVariant = variant;

	let inCart = false;

	function addToCart() {
		setCartProduct(currentVariant.id, quantity, currentVariant.id);
	}

	$: {
		currentVariant = variant;
		const i: any = $cart.lineItems.find((i) => {
			return currentVariant.id === i.variant.id;
		});

		inCart = !!i;
	}
</script>

<form on:submit={addToCart} class="mt-4">
	<button
		class={theme(
			`${themeName}.addToCard.button`,
			'disabled:bg-gray-200 bg-brand-primary uppercase py-2 px-4 tracking-wide',
		)}
		disabled={variant.availability === 'SoldOut'}
	>
		{variant.availability === 'SoldOut' ? 'Sold Out' : inCart ? 'Update Cart' : 'Add to Cart'}
	</button>

	{#if inCart && variant.availability !== 'SoldOut'}
		<a
			href="/checkout"
			class="inline-block bg-black text-white uppercase py-2 px-4 tracking-wide ml-2"
		>
			<Checkout width={16} height={16} class="mt-[-2px] mr-[2px] inline-block fill-brand-primary" />
			Check Out
		</a>
	{/if}
</form>

<div class={theme(`${themeName}.addToCart.shippingDateContainer`, 'uppercase mt-4')}>
	Ships on
	<span class={theme(`${themeName}.addToCart.shippingDate`)}> 2024 </span>
</div>
