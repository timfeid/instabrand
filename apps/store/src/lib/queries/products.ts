import { gql } from '@apollo/client';
import { error } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type {
	Product,
	ProductResponse,
} from '../../../../server/src/modules/product/product.schemas';
import { client } from '../request';
import { brand } from '../stores';

export async function getProducts(variables: { after?: string }) {
	try {
		const response = await client.query({
			query: gql`
				query ($brandId: String, $after: String) {
					products(brandId: $brandId, after: $after) {
						edges {
							cursor
							node {
								id
								name
								slug
								availability
								description
								label
								primaryImage {
									alt
									src
									srcset
									pictureSources {
										srcset
										media
									}
								}
								brand {
									color
									id
									logo
									name
								}
								price {
									actual
									compareAt
								}
							}
						}
					}
				}
			`,
			variables: {
				...variables,
				brandId: get(brand).id,
			},
			fetchPolicy: 'network-only',
		});

		return {
			products: response.data.products.edges.map((edge: any) => edge.node),
			pageInfo: response.data.pageInfo,
		};
	} catch (e) {
		console.log(get(brand));
		console.log(JSON.stringify(e, null, 2));
		throw error(404);
	}
}

export async function getProduct(
	slug: string,
	variantSlug = '',
	invalidate = false,
): Promise<ProductResponse> {
	try {
		const response = await client.query({
			query: gql`
				query Product($slug: String!, $brandId: String!, $variantSlug: String) {
					product(slug: $slug, brandId: $brandId, variantSlug: $variantSlug) {
						product {
							id
							name
							slug
							images {
								alt
								src
								srcset
								pictureSources {
									srcset
									media
								}
							}
						}
						variant {
							id
							price {
								actual
								compareAt
							}
						}
						types {
							name
							variants {
								value
								slug
								selected
							}
						}
					}
				}
			`,
			variables: {
				slug,
				brandId: get(brand).id,
				variantSlug,
			},
			fetchPolicy: invalidate ? 'network-only' : 'cache-first',
		});

		return response.data.product;
	} catch (e) {
		console.log(get(brand));
		console.log(JSON.stringify(e, null, 2));
		throw error(404);
	}
}
