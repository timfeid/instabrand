import { get, writable } from 'svelte/store';
import { donut, type Brand, type Theme } from '../mocks/brand.mock';

export const brand = writable<Brand>(donut);

// type KeyPath<T> = T extends Record<string, unknown>
// 	? {
// 			[K in keyof T]: T[K] extends Record<string, unknown> ? `${K}.${KeyPath<T[K]>}` | K : K;
// 	  }[keyof T]
// 	: never;

// type ThemeKeyPath = KeyPath<Theme>;

export function theme(key: string, defaultValue = ''): string {
	const keys = key.split('.');
	let value: any = get(brand).theme;

	for (const k of keys) {
		value = value[k];

		if (typeof value === 'undefined') {
			if (keys[0].startsWith('product') && keys[0] !== 'product') {
				return theme(`product.${keys.splice(1).join('.')}`, defaultValue);
			}
			return defaultValue;
		}
	}

	return value as string;
}
