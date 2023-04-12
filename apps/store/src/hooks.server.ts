import type { Handle } from '@sveltejs/kit';
import { FetchTransport, createClient } from '@rspc/client';
import type { Procedures } from './lib/bindings';
import { brand } from './lib/stores';
import { get } from 'svelte/store';

let cookie = '';

const client = createClient<Procedures>({
	transport: new FetchTransport('http://localhost:9000/rspc/1', (input, init) =>
		fetch(input, { ...init, credentials: 'include', headers: [['Cookie', cookie]] }),
	),
});

export const handle: Handle = async ({ event, resolve }) => {
	cookie = event.request.headers.get('cookie') || '';

	const response = await client.query(['cart.get', get(brand).id]);

	event.locals.cart = response;

	return await resolve(event);
};
