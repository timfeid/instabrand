import { PUBLIC_GRAPHQL_ENDPOINT, PUBLIC_USES_CACHING } from '$env/static/public';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const graphqlEndpoint = PUBLIC_GRAPHQL_ENDPOINT;

export const link = new HttpLink({
	uri: graphqlEndpoint,
	credentials: 'include',
});

export const client = new ApolloClient({
	cache: new InMemoryCache({
		resultCaching: PUBLIC_USES_CACHING !== 'false',
	}),
	link,
});
