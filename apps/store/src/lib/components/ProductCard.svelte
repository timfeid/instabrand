<script lang="ts">
	import { brand } from '../stores';
	import { theme } from '../stores/brand';
	import Image from './Image.svelte';
	import ProductPrice from './product/ProductPrice.svelte';
	import ProductName from './product/ProductName.svelte';
	import ProductAvailability from './product/ProductAvailability.svelte';
	import ProductLabel from './product/ProductLabel.svelte';
	import type { Product } from '../bindings';

	export let product: Product;

	let href = `/product/${product.slug}`;
	let productData = {themeName: 'productCard' as 'productCard', product}

	$: {
		productData.product = product;
	}

</script>

<div>
	<a {href} aria-label={product.name}>
		<div class={theme('productCard.imageAndLabelContainer', "relative")}>
			{#if product.primary_image}
				<Image image={product.primary_image} />
			{/if}
			<ProductLabel {...productData} />
		</div>
	</a>
	<div class={theme('productCard.descriptionContainer', 'text-center space-y-2 mt-8')}>
		<a {href} aria-label={product.name}>
			<ProductName {...productData} />
		</a>

		<ProductPrice price={product.price} themeName="productCard" />

		<ProductAvailability {...productData}  />
	</div>
</div>
