'use client';

import { Product } from '@/utils/interfaces';
import { Store } from '@/utils/store';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';

export default function AddToCart({
	product,
	redirect = true
}: {
	product: Product;
	redirect?: boolean;
}) {
	const { state, dispatch } = useContext(Store);

	const router = useRouter();

	const addToCartHandler = async () => {
		const existItem = state.cart.cartItems.find(
			x => x.slug === product.slug
		);
		const quantity = existItem ? existItem.quantity + 1 : 1;

		// we get fresh data of this product, in case another user has bought on product, so the stock may differ
		const { data } = await axios.get(
			`/api/products/${product._id}`
		);

		if (data.countInStock < quantity) {
			return toast.error('Sorry, Product is out of stock!');
		}
		dispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...product, quantity }
		});
		if (redirect) {
			router.push('/cart');
		} else {
			toast.success('Product added to the cart');
		}
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
