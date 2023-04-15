import { getCart } from '../../../lib/queries/cart';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		cart: await getCart(locals.cart?.id),
	};
};
