import { gql } from '@apollo/client';
import { readable } from 'svelte/store';
import { client } from '../request';

type State = {
	name: string;
	abbreviation: string;
};

export const states = readable<State[]>([], (set) => {
	client
		.query({
			query: gql`
				query {
					states {
						name
						abbreviation
					}
				}
			`,
		})
		.then((states) => set(states.data.states));
});
