'use client';

import { createContext, useReducer } from 'react';

interface cartItem {
	name: string;
	slug: string;
	quantity: number;
}

interface InitialStateType {
	cart: { cartItems: cartItem[] };
}

interface Action {
	type: 'CART_ADD_ITEM';
	payload: cartItem;
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
		case 'CART_ADD_ITEM':
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

		default:
			return state;
	}
}
export function StoreProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const value = { state, dispatch };

	return <Store.Provider value={value}>{children}</Store.Provider>;
}
