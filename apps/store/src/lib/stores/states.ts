import { gql } from '@apollo/client';
import { readable } from 'svelte/store';
import type { State } from '../bindings';
import { client } from '../client';

export const states = readable<State[]>([], (set) => {
	client.query(['state.list']).then((states) => set(states));
});
