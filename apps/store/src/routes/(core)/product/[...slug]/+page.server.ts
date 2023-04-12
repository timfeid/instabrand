import { getProduct, getProducts } from '../../../../lib/queries/products';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function ({ params }) {
	const productSlug = params.slug.split('/').shift();
	const variantSlug = params.slug.split('/')[1];
	const product = await getProduct(productSlug || '', variantSlug);

	return {
		product,
	};
};
