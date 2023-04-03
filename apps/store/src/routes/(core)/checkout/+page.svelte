<script lang="ts">
	import type { PageData } from './$types';
	import Loading from '$lib/components/checkout/Loading.svelte';
	import Idle from '$lib/components/checkout/Idle.svelte';
	import Success from '$lib/components/checkout/Success.svelte';
	import CartSummary from '$lib/components/cart/CartSummary.svelte';
	import CheckoutButton from '$lib/components/checkout/CheckoutButton.svelte';
	import { checkout } from '../../../lib/stores/checkout';
	import { cart } from '../../../lib/stores/cart';

	export let data: PageData;

	const options = [
		{ state: 'idle', component: Idle },
		{ state: 'loading', component: Loading },
		{ state: 'success', component: Success },
	];

	let selected = options[0];

	checkout.subscribe((data) => {
		selected = options.find((option) => option.state === data.state) || options[0];
	});

	// console.log(data.cart)
	// cart.set({
	//   ...data.cart.invoice,
	//   sync: false,
	// })

	// const c = {...data.cart.invoice}
</script>

<div class="pt-6">
	<div class="font-normal mb-6">Checkout</div>

	{JSON.stringify(selected.state)}

	<div class="flex flex-col lg:flex-row">
		<div class="bg-white md:p-4 rounded md:shadow w-full lg:w-2/3">
			<svelte:component this={selected.component} {data} />
		</div>

		<div
			class="md:p-4 rounded md:shadow w-full mb-4 lg:mb-0 lg:w-1/3 lg:ml-8 h-min mt-6 md:mt-0 px-4 md:px-4"
		>
			{#if $checkout.currentStep > 0}
				<div class="border-b mb-4 pb-4">
					<div class="flex flex-col md:flex-row">
						<div class="w-full md:w-1/2">
							<div class="mb-1 text-sm text-gray-600">Who</div>
							<div>
								<div>
									{$checkout.customer.firstName}
								</div>
								<div>
									{$checkout.customer.phone}
								</div>
							</div>
						</div>
						<div class="w-full md:w-1/2">
							<div class="mb-1 text-sm text-gray-600 mt-6 md:mt-0">Location</div>
							<div>
								{#if $checkout.address.line1}
									<address class="not-italic">
										{$checkout.address.line1}<br />
										{#if $checkout.address.line2}
											{$checkout.address.line2}<br />
										{/if}
										{$checkout.address.city},
										{$checkout.address.state}
										{$checkout.address.zip}
									</address>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<CartSummary />

			{#if $checkout.state === 'idle'}
				<div class="mt-6 flex justify-center">
					<CheckoutButton />
				</div>
			{/if}
		</div>
	</div>
</div>
