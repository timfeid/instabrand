import { gql } from '@apollo/client';

export const cartFragment = gql`
	fragment Cart on Cart {
		order {
			id
			lineItems {
				quantity
				variant {
					id
					price {
						actual
						compareAt
					}
					slug
					size
					color
					material
					style
					image {
						alt
						src
						srcset
						pictureSources {
							srcset
							media
						}
					}
					product {
						name
						slug
					}
				}
			}

			subtotal
		}
	}
`;
