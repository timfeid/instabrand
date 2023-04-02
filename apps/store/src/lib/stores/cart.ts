import { writable, get } from 'svelte/store';
import { brand } from './brand';
import { client } from '../request';
import { gql } from '@apollo/client';
import { cartFragment } from '../fragments/cart.fragment';
import { browser } from '$app/environment';

export const defaultCart: Cart = {
	lineItems: [],
	id: '',
	sync: false,
};

type LineItem = {
	variant: { id: string };
	quantity: number;
};

export type Cart = {
	lineItems: LineItem[];
	id: string | null;
	sync: boolean;
};

export const cart = writable<Cart>({ ...defaultCart });

export const setCartProduct = (
	variantId: string,
	quantity: number,
	replace: string | false = false,
) => {
	cart.update((cart) => {
		const lineItems = [...cart.lineItems];

		if (replace && replace !== variantId) {
			const replaceIndex = lineItems.findIndex((product) => product.variant.id === replace);
			if (replaceIndex !== -1) {
				lineItems.splice(replaceIndex, 1);
			}
		}

		const productIndex = lineItems.findIndex((product) => product.variant.id === variantId);

		if (productIndex >= 0) {
			if (quantity === 0) {
				lineItems.splice(productIndex, 1);
			} else if (!replace) {
				lineItems[productIndex].quantity += quantity;
			} else {
				lineItems[productIndex].quantity = quantity;
			}
		} else if (quantity > 0) {
			lineItems.push({ variant: { id: variantId }, quantity });
		}

		cart.lineItems = lineItems;
		cart.sync = true;

		return cart;
	});
};

export const cartTotalProducts = writable(0);

let times = 0;

cart.subscribe(async (data) => {
	let total = 0;
	const brandId = get(brand)?.id;

	for (const product of data.lineItems) {
		total += product.quantity;
	}

	cartTotalProducts.set(total);

	// first time is on subscribe
	// second time is setting from session
	if (browser && ++times > 1 && data.sync !== false) {
		try {
			const response = await client.mutate({
				mutation: gql`
					${cartFragment}
					mutation setCart($id: String, $lineItems: [SetCartItem]!, $brandId: String!) {
						setCart(id: $id, lineItems: $lineItems, brandId: $brandId) {
							...Cart
						}
					}
				`,
				variables: {
					id: data.id,
					lineItems: data.lineItems.map((li) => {
						return { variantId: li.variant.id, quantity: li.quantity };
					}),
					brandId,
				},
				fetchPolicy: 'network-only',
			});
			cart.set({ ...response.data.setCart.order, sync: false });
		} catch (e) {
			console.log(e);
		}
	}
});
