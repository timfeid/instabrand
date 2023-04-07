<script lang="ts">
	import { PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { createPaymentIntent } from '$lib/mutations/create-payment-intent';
	import { cart } from '$lib/stores/cart';
	import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
	import { onMount } from 'svelte';
	import { Address, Elements, PaymentElement } from 'svelte-stripe';
	import { paymentSubmitted } from '../../mutations/payment-submitted';
	import { brand } from '../../stores';

	let stripe: Stripe | null;
	let paymentIntentId: '';
	let paymentIntentSecret = '';
	let elements: StripeElements;
	let loading = false;

	const appearance = {
		theme: 'flat' as 'flat',
		variables: {
			fontFamily: ' "Gill Sans", sans-serif',
			fontLineHeight: '1.5',
			borderRadius: '10px',
			colorBackground: '#FFFFFF',
			colorPrimaryText: '#262626',
		},
		rules: {
			'.Block': {
				backgroundColor: 'var(--colorBackground)',
				boxShadow: 'none',
				padding: '12px',
			},
			'.Input': {
				padding: '12px',
				border: '1px solid #232323',
			},
			'.Input:disabled, .Input--invalid:disabled': {
				color: 'lightgray',
			},
			'.Tab': {
				padding: '10px 12px 8px 12px',
				backgroundColor: $brand.color,
				border: 'none',
			},
			'.Tab:hover': {
				border: 'none',
				boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
			},
			'.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
				border: '2px solid black',
				backgroundColor: $brand.color,
				boxShadow:
					'0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)',
			},
			'.Label': {
				fontWeight: '500',
				border: '1px solid red',
			},
		},
	};

	async function submit() {
		if (!stripe || !elements || loading) {
			console.log('failed', stripe, elements);

			return;
		}

		loading = true;
		console.log('hello', stripe, elements);

		const result = await stripe.confirmPayment({
			elements,
			redirect: 'if_required',
		});

		loading = false;

		if (result.error) {
			console.log(result);
			return;
		}

		await paymentSubmitted(result.paymentIntent.id);
	}

	onMount(async () => {
		stripe = await loadStripe(PUBLIC_STRIPE_KEY);
		if ($cart.id) {
			const details = await createPaymentIntent($cart.id);
			paymentIntentId = details.id;
			paymentIntentSecret = details.secret;
		}
	});
</script>

{#if stripe && paymentIntentId && paymentIntentSecret}
	<form on:submit|preventDefault={submit}>
		<Elements
			{stripe}
			clientSecret={paymentIntentSecret}
			labels="floating"
			{...appearance}
			bind:elements
		>
			<PaymentElement />
			<Address mode="billing" />

			<button disabled={loading}>Pay</button>
		</Elements>
	</form>
{/if}
