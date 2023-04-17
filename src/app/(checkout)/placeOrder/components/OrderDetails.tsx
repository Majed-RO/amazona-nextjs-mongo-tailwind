'use client';

import { getError } from '@/utils/error';
import { Store } from '@/utils/store';
import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function OrderDetails() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const { cartItems, shippingAddress, paymentMethod } = cart;

	const round2 = (num: number) =>
		Math.round(num * 100 + Number.EPSILON) / 100;

	// a = accumulator, c = current item
	const itemsPrice = round2(
		cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
	); // 123.3456 => 123.35

	const shippingPrice = itemsPrice > 200 ? 0 : 15;

	const taxPrice = round2(itemsPrice * 0.15);

	const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

	useEffect(() => {
		if (!paymentMethod) {
			router.push('/payment');
		}
	}, [paymentMethod, router]);

	const placeOrderHandler = async () => {
		try {
			setLoading(true);

			const { data } = await axios.post('/api/orders', {
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice
			});

			setLoading(false);

			dispatch({ type: 'CART_CLEAR_ITEMS' });

			Cookies.set(
				'cart',
				JSON.stringify({
					...cart,
					cartItems: []
				})
			);

			router.push(`/order/${data._id}`);
		} catch (error: any) {
			setLoading(false);
			toast.error(getError(error));
		}
	};

	return (
		<div>
			{cartItems.length === 0 ? (
				<div>
					Cart is empty.{' '}
					<Link href={'/'}>Go Shipping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
						<div className="card p-5">
							<h2 className="mb-2 text-lg">
								Shipping Address
							</h2>
							<div>
								{
									shippingAddress.fullName
								}
								,{' '}
								{
									shippingAddress.address
								}
								,
								{
									shippingAddress.city
								}
								,{' '}
								{
									shippingAddress.postalCode
								}
								,
								{
									shippingAddress.country
								}
							</div>
							<div>
								<Link
									href={
										'/shipping'
									}
								>
									Edit
								</Link>
							</div>
						</div>
						<div className="card p-5">
							<h2 className="mb-2 text-lg">
								Payment Method
							</h2>
							<div>
								{paymentMethod}
							</div>
							<div>
								<Link
									href={
										'/payment'
									}
								>
									Edit
								</Link>
							</div>
						</div>
						<div className="card overflow-x-auto p-5">
							<h2 className="mb-2 text-lg">
								Order items
							</h2>
							<table className="min-w-full">
								<thead className="border-b">
									<tr>
										<th className="px-5 text-left">
											Item
										</th>
										<th className="p-5 text-right">
											Quantity
										</th>
										<th className="p-5 text-right">
											Price
										</th>
										<th className="p-5 text-right ">
											Subtotal
										</th>
									</tr>
								</thead>
								<tbody>
									{cartItems.map(
										item => (
											<tr
												key={
													item._id
												}
												className="border-b"
											>
												<td>
													<Link
														href={`/product/${item.slug}`}
														className=" flex items-center"
													>
														<Image
															src={
																item.image
															}
															alt={
																item.name
															}
															width={
																50
															}
															height={
																50
															}
														/>{' '}
														&nbsp;
														{
															item.name
														}
													</Link>
												</td>
												<td className="p-5 text-right">
													{
														item.quantity
													}
												</td>
												<td className="p-5 text-right">
													{
														item.price
													}
												</td>
												<td className="p-5 text-right">
													{item.quantity *
														item.price}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
							<div>
								<Link
									href={
										'/cart'
									}
								>
									Edit
								</Link>
							</div>
						</div>
					</div>
					<div>
						<div className="card p-5">
							<h2 className="mb-2 text-lg">
								Order Summary
							</h2>
							<ul>
								<li>
									<div className="mb-2 flex justify-between">
										<div>
											Items
										</div>
										<div>
											$
											{
												itemsPrice
											}
										</div>
									</div>
								</li>
								<li>
									<div className="mb-2 flex justify-between">
										<div>
											Tax
										</div>
										<div>
											$
											{
												taxPrice
											}
										</div>
									</div>
								</li>
								<li>
									<div className="mb-2 flex justify-between">
										<div>
											Shipping
										</div>
										<div>
											$
											{
												shippingPrice
											}
										</div>
									</div>
								</li>
								<li>
									<div className="mb-2 flex justify-between">
										<div>
											Total
										</div>
										<div>
											$
											{
												totalPrice
											}
										</div>
									</div>
								</li>
								<li>
									<button
										className="primary-button w-full"
										disabled={
											loading
										}
										onClick={
											placeOrderHandler
										}
									>
										{loading
											? 'Loading...'
											: 'Place Order'}
									</button>
								</li>
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
