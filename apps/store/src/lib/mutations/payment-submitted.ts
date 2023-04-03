import { gql } from '@apollo/client';
import { get } from 'svelte/store';
import { client } from '../request';
import { cart, defaultCart } from '../stores/cart';
import { checkout } from '../stores/checkout';

export async function paymentSubmitted(paymentIntentId: string) {
	checkout.update((data) => ({
		...data,
		state: 'loading',
	}));

	try {
		const $checkout = get(checkout);

		await client.mutate({
			mutation: gql`
				mutation checkout($paymentIntentId: String!, $data: CheckoutInput!) {
					checkout(paymentIntentId: $paymentIntentId, data: $data)
				}
			`,
			variables: {
				paymentIntentId,
				data: {
					address: $checkout.address,
					customer: $checkout.customer,
				},
			},
		});

		checkout.update((data) => ({
			...data,
			state: 'success',
		}));

		cart.set({ ...defaultCart, sync: false });
	} catch (e) {
		console.log(e);
	}

	checkout.update((data) => ({
		...data,
		state: 'idle',
	}));
}
