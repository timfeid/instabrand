import { writable } from 'svelte/store';

const defaultCheckout: Checkout = {
	deliveryMethod: 'delivery',
	customer: {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
	},
	address: {
		line1: '',
		line2: '',
		city: '',
		state: '',
		zip: '',
	},
	currentStep: 0,
	state: 'idle',
};

type DeliveryMethod = {
	name: string;
	disabled: boolean;
	disabledReason?: string;
};

export type Address = {
	line1: string;
	line2: string;
	city: string;
	state: string;
	zip: string;
};

export type Customer = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
};

export type Checkout = {
	deliveryMethod: 'pickup' | 'delivery';
	address: Address;
	customer: Customer;
	currentStep: number;
	state: 'idle' | 'loading' | 'success';
};

export const checkout = writable<Checkout>({ ...defaultCheckout });
export const deliveryMethods = writable<DeliveryMethod[]>([]);

export const nextStep = () => {
	checkout.update((data) => ({
		...data,
		currentStep: data.currentStep + 1,
	}));
};

checkout.subscribe((data) => {
	console.log('subscribe data', data);
});
