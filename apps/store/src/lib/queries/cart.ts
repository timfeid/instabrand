import { client } from '../client';

export async function getCart(id: string | undefined) {
	if (!id) {
		return null;
	}

	return await client.query(['cart.getById', id]);
}
