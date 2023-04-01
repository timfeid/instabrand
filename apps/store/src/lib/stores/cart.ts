import { writable, get } from 'svelte/store';
import { deliveryMethods } from './checkout';
import { brand } from './brand';
import { client } from '../request';
import { gql } from '@apollo/client';
import { cartFragment } from '../fragments/cart.fragment';

export const defaultCart: Cart = {
	products: [],
	id: '',
	sync: false,
};

type CartProduct = {
	variantSlug: string;
	quantity: number;
};

export type Cart = {
	products: CartProduct[];
	id: string | null;
	sync: boolean;
};

export const cart = writable<Cart>({ ...defaultCart });

export const setCartProduct = (
	variantSlug: string,
	quantity: number,
	replace: string | false = false,
) => {
	cart.update((cart) => {
		const products = [...cart.products];

		if (replace && replace !== variantSlug) {
			const replaceIndex = products.findIndex((product) => product.variantSlug === replace);
			if (replaceIndex !== -1) {
				products.splice(replaceIndex, 1);
			}
		}

		const productIndex = products.findIndex((product) => product.variantSlug === variantSlug);

		if (productIndex >= 0) {
			if (quantity === 0) {
				products.splice(productIndex, 1);
			} else if (!replace) {
				products[productIndex].quantity += quantity;
			} else {
				products[productIndex].quantity = quantity;
			}
		} else if (quantity > 0) {
			products.push({ variantSlug, quantity });
		}

		cart.products = products;
		cart.sync = true;

		return cart;
	});
};

export const cartTotalProducts = writable(0);

const times = 0;

cart.subscribe(async (data) => {
	let total = 0;
	const brandId = get(brand)?.id;

	for (const product of data.products) {
		total += product.quantity;
	}

	cartTotalProducts.set(total);

	// first time is on subscribe
	// second time is setting from session
	if (false) {
		try {
			const response = await client.mutate({
				mutation: gql`mutation setCart($data: String!, $brandId: String!) {
					${cartFragment}
					setCart(data: $data, brandId: $brandId) {
						...Cart
					}
				}`,
				variables: {
					data: JSON.stringify({
						id: data.id,
						products: data.products.map((product) => ({
							variantSlug: product.variantSlug,
							quantity: product.quantity,
						})),
					}),
					brandId,
				},
			});

			const setCart = response.data;

			console.log(setCart);
			cart.set({ ...setCart.invoice, sync: false });
			deliveryMethods.set(setCart.deliveryMethods);
		} catch (e) {
			console.log(e);
		}
	}
});
