<script lang="ts">
	import type { ProductPrice } from '../../bindings';
	import { theme } from '../../stores/brand';

	export let price: ProductPrice;
	export let themeName: 'productCard' | 'productPage' | 'cartLineItem';

	const formatter = Intl.NumberFormat('en-us', {
		currency: 'USD',
		style: 'currency',
	});

	let actual = formatter.format(price.actual_cents / 100);
	let compareAt = price.compare_at_cents && formatter.format(price.compare_at_cents / 100);
</script>

<div class={theme(`${themeName}.priceContainer`)}>
	<span class={theme(`${themeName}.priceActual`)}>{actual}</span>
	{#if compareAt}
		<span class={theme(`${themeName}.priceCompareAt`, 'line-through text-gray-500')}
			>{compareAt}</span
		>
	{/if}
</div>
