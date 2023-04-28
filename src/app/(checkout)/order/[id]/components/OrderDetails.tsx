'use client';

import { getError } from '@/utils/error';
import axios from 'axios';
import { useEffect, useReducer } from 'react';

import { Order, OrderItem } from '@/utils/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import {
	PayPalButtons,
	SCRIPT_LOADING_STATE,
	usePayPalScriptReducer
} from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import {
	OnApproveData,
	OnApproveActions,
	CreateOrderData,
	CreateOrderActions
} from '@paypal/paypal-js/types/components/buttons';

interface State {
	loading: boolean;
	order: Order;
	error: string;
	loadingPay?: boolean;
	successPay?: boolean;
	errorPay?: string;
}

interface Action {
	type: string;
	payload?: any;
}

function reducer(state: State, action: Action) {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				error: '',
				order: action.payload
			};
		case 'FETCH_FAIL':
			return {
				...state,
				loading: false,
				error: action.payload
			};

		case 'PAY_REQUEST':
			return {
				...state,
				loadingPay: true
			};

		case 'PAY_SUCCESS':
			return {
				...state,
				loadingPay: false,
				successPay: true
			};

		case 'PAY_FAIL':
			return {
				...state,
				loadingPay: false,
				errorPay: action.payload
			};

		case 'PAY_RESET':
			return {
				...state,
				loadingPay: false,
				successPay: false,
				errorPay: ''
			};

		default:
			return state;
	}
}

export default function OrderDetails({ orderId }: { orderId: string }) {
	const [{ loading, error, order, successPay, loadingPay }, dispatch] =
		useReducer(reducer, {
			loading: true,
			order: {},
			error: ''
		});

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(
					`/api/orders/${orderId}`
				);
				dispatch({
					type: 'FETCH_SUCCESS',
					payload: data
				});
			} catch (error: any) {
				dispatch({
					type: 'FETCH_FAIL',
					payload: getError(error)
				});
			}
		};
		if (
			!order._id ||
			successPay ||
			(order._id && order._id !== orderId)
		) {
			fetchOrder();

			if (successPay) {
				dispatch({ type: 'PAY_RESET' });
			}
		} else {
			const loadPaypalScript = async () => {
				const { data: clientId } = await axios.get(
					'/api/keys/paypal'
				);

				paypalDispatch({
					type: 'resetOptions',
					value: {
						'client-id': clientId,
						currency: 'USD'
					}
				});
				paypalDispatch({
					type: 'setLoadingStatus',
					value: SCRIPT_LOADING_STATE.PENDING
				});
			};

			loadPaypalScript();
		}
	}, [order, orderId, paypalDispatch, successPay]);

	const {
		shippingAddress,
		paymentMethod,
		orderItems,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		isPaid,
		paidAt,
		isDelivered,
		deliveredAt
	} = order;

	async function createOrder(
		data: CreateOrderData,
		actions: CreateOrderActions
	) {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: { value: totalPrice }
					}
				]
			})
			.then((orderID: string) => {
				return orderID;
			});
	}

	async function onApprove(
		data: OnApproveData,
		actions: OnApproveActions
	) {
		// to complete the payment
		return actions?.order?.capture().then(async function (details) {
			try {
				dispatch({ type: 'PAY_REQUEST' });

				// PUT is used to send data to a server to create/update a resource.
				// calling the same PUT request multiple times will always produce the same result. In contrast, calling a POST request repeatedly have side effects of creating the same resource multiple times.
				const { data } = await axios.put(
					`/api/orders/${order._id}/pay`,
					details
				);

				dispatch({
					type: 'PAY_SUCCESS',
					payload: data
				});

				toast.success('Order is paid successfully');
			} catch (error: any) {
				dispatch({
					type: 'PAY_FAIL',
					payload: getError(error)
				});
				toast.error(getError(error));
			}
		});
	}

	function onError(err: any) {
		toast.error(getError(err));
	}

	return (
		<div>
			{loading ? (
				<div>Loading...</div>
			) : error ? (
				<div className="alert-error">{error}</div>
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
								,{' '}
								{
									shippingAddress.city
								}
								,{' '}
								{
									shippingAddress.postalCode
								}
								,{' '}
								{
									shippingAddress.country
								}
							</div>
							{isDelivered ? (
								<div className="alert-success">
									Delivered
									at{' '}
									{
										deliveredAt
									}
								</div>
							) : (
								<div className="alert-error">
									Not
									delivered
								</div>
							)}
						</div>

						<div className="card p-5">
							<h2 className="mb-2 text-lg">
								Payment Method
							</h2>
							<div>
								{paymentMethod}
							</div>
							{isPaid ? (
								<div className="alert-success">
									Paid at{' '}
									{paidAt}
								</div>
							) : (
								<div className="alert-error">
									Not paid
								</div>
							)}
						</div>
						{/* order items */}
						<div className="card overflow-x-auto p-5">
							<h2 className="mb-2 text-lg">
								Order Items
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
									{orderItems.map(
										(
											item: OrderItem
										) => (
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
													$
													{
														item.price
													}
												</td>
												<td className="p-5 text-right">
													$
													{item.quantity *
														item.price}
												</td>
											</tr>
										)
									)}
								</tbody>
							</table>
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
								{!isPaid && (
									<li>
										{isPending ? (
											<div>
												Loading...
											</div>
										) : (
											<div className="w-full">
												<PayPalButtons
													createOrder={
														createOrder
													}
													onApprove={
														onApprove
													}
													onError={
														onError
													}
												></PayPalButtons>
											</div>
										)}
									</li>
								)}
								{loadingPay && (
									<div>
										Loading...
									</div>
								)}
							</ul>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
