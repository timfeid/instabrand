<script lang="ts">
	import type { LineItem } from '../../bindings';
	import Image from '../Image.svelte';
	import ProductQuantity from '../product/ProductQuantity.svelte';

	export let items: LineItem[];
	export let editable = true;
</script>

{#each items as row}
	<div class="last:border-0 last:mb-0 last:pb-0 border-b pb-4 mb-4 flex flex-col md:flex-row">
		<div class="flex flex-row w-full">
			<div class="w-80 h-80 mr-16">
				{#if row.variant.image}
					<Image image={row.variant.image} />
				{/if}
			</div>
			<div class="flex flex-col md:flex-row ml-4 flex-grow">
				<div class="flex flex-col justify-center">
					<a
						class="text-md bg-brand-primary px-2 py-1"
						href={`/product/${row.variant.product.slug}/${row.variant.slug}`}
						>{row.variant.product.name}</a
					>
					<div class="text-sm mt-1">
						{#each ['size', 'color', 'material', 'style'] as prop}
              {#if row.variant[prop]}
                <div>
                  {prop}: {row.variant[prop]}
                </div>
              {/if}
						{/each}
					</div>
					<div class="mt-1 font-normal mb-4">
						{row.quantity} &times; @ {row.pricePer}
					</div>
          {#if editable}
            <ProductQuantity quantity={row.quantity} variant={row.variant} themeName="productPage" replaceOnChange />
          {/if}
				</div>
			</div>
		</div>
	</div>
{/each}
