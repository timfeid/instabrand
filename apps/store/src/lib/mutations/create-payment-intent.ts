import { gql } from '@apollo/client';
import { client } from '../client';

export async function createPaymentIntent(orderId: string) {
	return await client.mutation(['cart.createIntent', orderId]);
}
