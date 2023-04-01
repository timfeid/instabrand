import { gql } from '@apollo/client';

export const cartFragment = gql`
	fragment Cart on Cart {
		deliveryMethods {
			name
			disabled
			disabledReason
		}
		order {
			id
			orderStatus
			salesTax
			subtotal
			total
			items {
				priceId
				pricePer
				quantity
				totalPrice
				weight
				item {
					slug
					name
					image
					lineage {
						name
					}
					brand {
						name
					}
					prices {
						id
						price
						weight
					}
				}
			}
		}
	}
`;
