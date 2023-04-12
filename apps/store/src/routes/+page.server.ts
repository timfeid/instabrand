import { getProducts } from '$lib/queries/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function () {
	const products = await getProducts();

	return {
		products,
	};
};
