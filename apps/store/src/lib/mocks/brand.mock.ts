import { ProductAvailability } from '../types';

type ProductTheme = {
	availability?: Partial<Record<ProductAvailability, string>>;
	priceContainer?: string;
	priceCompareAt?: string;
	priceActual?: string;
	name?: string;
	descriptionDiv?: string;
	label?: string;
	labelContainer?: string;
	descriptionContainer?: string;
	addToCart?: {
		button?: string;
		quantityButtonContainer?: string;
		quantityButton?: string;
		label?: string;
	};
	// addToCard?: Partial<Record<ProductAvailability, string>>;
};

type ProductCardTheme = ProductTheme & {
	imageAndLabelContainer?: string;
};

type ProductPageTheme = ProductTheme & {
	infoContainer?: string;
};

export type Theme = {
	product?: ProductTheme;
	productCard?: ProductCardTheme;
	productPage?: ProductPageTheme;
};

export type Brand = {
	id: string;
	name: string;
	theme: Theme;
	color: string;
};

export const donut: Brand = {
	id: '01GWT4W42WH4FFERNG1APADG6Z',
	color: '#fcd510',
	name: 'Donut Media',
	theme: {
		product: {
			name: 'uppercase text-xl',
			availability: {
				[ProductAvailability.SoldOut]: 'text-red-900',
			},
			priceCompareAt: 'line-through text-gray-500',
			label: 'bg-black text-sm text-brand-primary px-4 py-1 w-fit mx-auto',
		},
		productCard: {},
		productPage: {
			name: 'uppercase text-4xl',
			label: 'bg-black text-sm text-brand-primary px-4 py-1 w-fit',
			labelContainer: '',
			priceActual: 'text-4xl',
			addToCart: {
				label: 'lowercase mb-1',
			},
		},
	},
};
