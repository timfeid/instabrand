<script lang="ts">
	import { theme } from '../../stores/brand';
	import { cart, setCartProduct } from '../../stores/cart';
	import Plus from '$lib/icons/ui/Plus.svg?component';
	import Minus from '$lib/icons/ui/Minus.svg?component';
	import type { Variant } from '../../bindings';

	export let variant: Variant;
	export let themeName: 'productCard' | 'productPage';
	export let quantity = 1;
	export let replaceOnChange = false;

	let currentVariant = variant;
	let lowestQuantity = 1;

	const changeQuantity = (val: number) => {
		quantity = val + quantity;
		if (quantity < lowestQuantity) {
			quantity = lowestQuantity;
		}

		if (replaceOnChange) {
			setCartProduct(currentVariant.id, quantity, currentVariant.id)
		}
	};

	$: {
		currentVariant = variant;
		const currentLineItem: any = $cart.lineItems.find((i) => {
			return currentVariant.id === i.variant.id;
		});

		if (!!currentLineItem) {
			quantity = currentLineItem.quantity;
			lowestQuantity = 0;
		} else {
			quantity = 1;
		}
	}
</script>

{#if variant.availability !== 'SoldOut'}
	<div class={theme(`${themeName}.addToCart.label`)}>Quantity</div>

	<div
		class={theme(
			`${themeName}.addToCart.quantityButtonContainer`,
			'flex p-2 space-x-4 items-center border w-fit rounded',
		)}
	>
		<button
			disabled={lowestQuantity === quantity}
			type="button"
			class={theme(
				`${themeName}.addToCart.quantityButton`,
				'rounded-full stroke-black disabled:stroke-gray-300 transition-colors duration-50',
			)}
			on:click={() => changeQuantity(-1)}
		>
			<Minus width={24} height={24} />
		</button>
		<div>{quantity}</div>
		<button
			type="button"
			class={theme(`${themeName}.addToCart.quantityButton`, 'rounded-full')}
			on:click={() => changeQuantity(1)}
		>
			<Plus width={24} height={24} class="stroke-black" />
		</button>
	</div>
{/if}
