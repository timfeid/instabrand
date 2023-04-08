import { client } from '../client';

export async function getProducts() {
	const products = await client.query(['products.list']);

	return {
		products,
	};
}

export async function getProduct(slug: string, variantSlug: string | null = null) {
	return await client.query(['products.get', [slug, variantSlug]]);
}
