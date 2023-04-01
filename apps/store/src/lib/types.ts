type PictureSources = {
	media: string;
	srcset: string;
};

type ProductPrice = {
	actual: string;
	compareAt?: string;
};

export type Image = {
	pictureSources: PictureSources[];
	src: string;
	srcset: string;
	alt: string;
};

export type Product = {
	id: string;
	description: string;
	shippingDate: string;
	title: string;
	slug: string;
	images: Image[];
	label?: string;
	price: ProductPrice;
	availability: ProductAvailability;
};

export enum ProductAvailability {
	InStock = 'InStock',
	Limited = 'Limited',
	SoldOut = 'SoldOut',
	PreOrder = 'PreOrder',
}
