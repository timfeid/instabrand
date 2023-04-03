import { gql } from '@apollo/client';
import { client } from '../request';

export async function createPaymentIntent(orderId: string) {
	const response = await client.mutate({
		mutation: gql`
			mutation CreatePaymentIntent($orderId: String!) {
				createPaymentIntent(orderId: $orderId) {
					id
					secret
				}
			}
		`,
		variables: {
			orderId,
		},
	});

	return response.data.createPaymentIntent;
}
