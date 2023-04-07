import { error } from '@sveltejs/kit';
import { client } from '../lib/client';
import type { PageServerLoad } from './$types';
import type { RSPCError } from '@rspc/client';

export const load: PageServerLoad = async () => {
	try {
		const product = await client.query(['products.get', 'hat']);
		return {
			product
		};
	} catch (e) {
		if ((e as RSPCError)?.code === 404) {
			throw error(404);
		}

		console.error(e);
	}

	throw error(500);
};
