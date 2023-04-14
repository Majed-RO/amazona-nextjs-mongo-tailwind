'use client';

import { createContext, useReducer } from 'react';
import { Product } from './interfaces';
import Cookies from 'js-cookie';

export interface CartItem extends Product {
	quantity: number;
}

interface ShippingAddress {
	fullName: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

interface InitialStateType {
	cart: { cartItems: CartItem[]; shippingAddress: any };
}

interface Action {
	type: string;
	payload?: CartItem | any;
}

const initialState = {
	cart: Cookies.get('cart')
		? JSON.parse(Cookies.get('cart') ?? '')
		: { cartItems: [], shippingAddress: {} }
};

export const Store = createContext<{
	state: InitialStateType;
	dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

function reducer(state: InitialStateType, action: Action) {
	switch (action.type) {
		case 'CART_ADD_ITEM': {
			const newItem = action.payload;
			const existItem = state.cart.cartItems.find(
				item => item.slug === newItem?.slug
			);

			const cartItems = existItem
				? state.cart.cartItems.map(item =>
						item.name === existItem.name
							? newItem
							: item
				  )
				: [...state.cart.cartItems, newItem];
			Cookies.set(
				'cart',
				JSON.stringify({ ...state.cart, cartItems })
			);
			return { ...state, cart: { ...state.cart, cartItems } };
		}

		case 'CART_REMOVE_ITEM': {
			const cartItems = state.cart.cartItems.filter(
				item => item.slug !== action?.payload?.slug
			);
			Cookies.set(
				'cart',
				JSON.stringify({ ...state.cart, cartItems })
			);
			return { ...state, cart: { ...state.cart, cartItems } };
		}

		case 'CART_RESET': {
			return {
				...state,
				cart: {
					cartItems: [],
					shippingAddress: { location: {} },
					paymentMethod: ''
				}
			};
		}
		case 'SAVE_SHIPPING_ADDRESS': {
			return {
				...state,
				cart: {
					...state.cart,
					shippingAddress: {
						...state.cart.shippingAddress,
						...action.payload
					}
				}
			};
		}
		default:
			return state;
	}
}
export function StoreProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = { state, dispatch };

	return <Store.Provider value={value}>{children}</Store.Provider>;
}
