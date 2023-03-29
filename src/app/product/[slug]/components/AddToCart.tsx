'use client';
import { Product } from '@/utils/interfaces';
import { Store } from '@/utils/store';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';

export default function AddToCart({ product }: { product: Product }) {
	const { state, dispatch } = useContext(Store);

  const router = useRouter();

	const addToCartHandler = () => {
		const existItem = state.cart.cartItems.find(
			x => x.slug === product.slug
		);
		const quantity = existItem ? existItem.quantity + 1 : 1;

		if (product.countInStock < quantity) {
			alert('Sorry, Product is out of stock!');
			return;
		}
		dispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...product, quantity }
		});
    router.push("/cart")
	};
	return (
		<button
			className="primary-button w-full"
			onClick={addToCartHandler}
		>
			Add to cart
		</button>
	);
}
