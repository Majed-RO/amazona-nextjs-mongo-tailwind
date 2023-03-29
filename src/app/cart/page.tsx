'use client';

import { CartItem, Store } from '@/utils/store';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
// import dynamic from 'next/dynamic';

function CartScreen() {
	const { state, dispatch } = useContext(Store);

	const router = useRouter();

	const {
		cart: { cartItems }
	} = state;

  const [updatedCartItems, setUpdatedCartItems] = useState<CartItem[]>([]);

	const removeItemHandler = (item: CartItem) => {
		dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
	};

	const updateCartHandler = (item: CartItem, qty: string) => {
		const quantity = Number(qty);
		dispatch({
			type: 'CART_ADD_ITEM',
			payload: { ...item, quantity }
		});
	};

  /* to solve hydration errors */
  useEffect(() => {
    setUpdatedCartItems(cartItems)
  }, [cartItems]);

	return (
		<div>
			<h1 className="mb-4 text-xl">Shopping Cart</h1>
			{updatedCartItems.length === 0 ? (
				<div>
					Cart is empty.{' '}
					<Link href={'/'}>Go shopping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
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
									<th className="p-5 ">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{updatedCartItems.map(
									item => (
										<tr
											key={
												item.slug
											}
											className="border-b"
										>
											<td>
												<Link
													href={`/product/${item.slug}`}
													className="flex items-center space-x-2"
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
													/>
													<span>
														{
															item.name
														}
													</span>
												</Link>
											</td>
											<td className="p-5 text-right">
												<select
													value={
														item.quantity
													}
													onChange={e =>
														updateCartHandler(
															item,
															e
																.target
																.value
														)
													}
												>
													{[
														...Array(
															item.countInStock
														).keys()
													].map(
														x => (
															<option
																key={
																	x +
																	1
																}
																value={
																	x +
																	1
																}
															>
																{x +
																	1}
															</option>
														)
													)}
												</select>
											</td>
											<td className="p-5 text-right">
												$
												{
													item.price
												}
											</td>
											<td className="p-5 text-center">
												<button
													onClick={() =>
														removeItemHandler(
															item
														)
													}
												>
													<XCircleIcon className="h-5 w-5 text-red-600" />
												</button>
											</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
					<div className="card p-5">
						<ul>
							<li>
								<div className="pb-3 text-xl">
									Subtotal
									({' '}
									{updatedCartItems.reduce(
										(
											a,
											c
										) =>
											a +
											c.quantity,
										0
									)}{' '}
									) : $
									{updatedCartItems.reduce(
										(
											a,
											c
										) =>
											a +
											c.quantity *
												c.price,
										0
									)}
								</div>
							</li>
							<li>
								<button
									onClick={() =>
										router.push(
											'/shipping'
										)
									}
									className="primary-button w-full"
								>
									Check
									Out
								</button>
							</li>
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}

/* export default dynamic(() => Promise.resolve(CartScreen), {
	ssr: false
}); */
export default CartScreen;
