'use client';

import { createContext, useReducer } from 'react';
import { Product } from './interfaces';

interface CartItem extends Product {
	quantity: number;
}

interface InitialStateType {
	cart: { cartItems: CartItem[] };
}

interface Action {
	type: string;
	payload: CartItem;
}

const initialState = {
	cart: { cartItems: [] }
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
				item => item.slug === newItem.slug
			);

			const cartItems = existItem
				? state.cart.cartItems.map(item =>
						item.name === existItem.name
							? newItem
							: item
				  )
				: [...state.cart.cartItems, newItem];

			return { ...state, cart: { ...state.cart, cartItems } };
		}

		case 'CART_REMOVE_ITEM': {
			const cartItems = state.cart.cartItems.filter(
				item => item.slug !== action.payload.slug
			);
			return { ...state, cart: { ...state.cart, cartItems } };

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
