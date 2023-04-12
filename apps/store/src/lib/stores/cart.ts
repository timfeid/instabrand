import { writable, get } from 'svelte/store';
import { brand } from './brand';
import { gql } from '@apollo/client';
import { cartFragment } from '../fragments/cart.fragment';
import { browser } from '$app/environment';
import { client } from '../client';

export const defaultCart: Cart = {
	line_items: [],
	id: '',
	sync: false,
};

type LineItem = {
	variant: { id: string };
	quantity: number;
};

export type Cart = {
	line_items: LineItem[];
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
		const line_items = [...cart.line_items];

		if (replace && replace !== variantId) {
			const replaceIndex = line_items.findIndex((product) => product.variant.id === replace);
			if (replaceIndex !== -1) {
				line_items.splice(replaceIndex, 1);
			}
		}

		const productIndex = line_items.findIndex((product) => product.variant.id === variantId);

		if (productIndex >= 0) {
			if (quantity === 0) {
				line_items.splice(productIndex, 1);
			} else if (!replace) {
				line_items[productIndex].quantity += quantity;
			} else {
				line_items[productIndex].quantity = quantity;
			}
		} else if (quantity > 0) {
			line_items.push({ variant: { id: variantId }, quantity });
		}

		cart.line_items = line_items;
		cart.sync = true;

		return cart;
	});
};

export const cartTotalProducts = writable(0);

let times = 0;

cart.subscribe(async (data) => {
	let total = 0;
	const brandId = get(brand)?.id;

	for (const product of data.line_items) {
		total += product.quantity;
	}

	cartTotalProducts.set(total);

	// first time is on subscribe
	// second time is setting from session
	if (browser && ++times > 1 && data.sync !== false) {
		try {
			// const response = await client.mutate({
			// 	mutation: gql`
			// 		${cartFragment}
			// 		mutation setCart($id: String, $line_items: [SetCartItem]!, $brandId: String!) {
			// 			setCart(id: $id, line_items: $line_items, brandId: $brandId) {
			// 				...Cart
			// 			}
			// 		}
			// 	`,
			// 	variables: {

			// 	},
			// 	fetchPolicy: 'network-only',
			// });
			const response = await client.mutation([
				'cart.set',
				{
					line_items: data.line_items.map((li) => {
						return { variant_id: li.variant.id, quantity: li.quantity };
					}),
					brand_id: brandId,
				},
			]);
			cart.set({ ...response.order, sync: false });
		} catch (e) {
			console.log('error', e);
		}
	}
});
