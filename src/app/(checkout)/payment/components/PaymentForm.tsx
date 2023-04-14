'use client';

import { Store } from '@/utils/store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function PaymentForm() {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

	const { state, dispatch } = useContext(Store);

	const { cart } = state;
	const { shippingAddress, paymentMethod } = cart;

	const router = useRouter();

	/* https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/ */
	const submitHandler = (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (!selectedPaymentMethod) {
			return toast.error('Payment method is required!');
		}

		dispatch({
			type: 'SAVE_PAYMENT_METHOD',
			payload: selectedPaymentMethod
		});

		Cookies.set(
			'cart',
			JSON.stringify({
				...cart,
				paymentMethod: selectedPaymentMethod
			})
		);
		router.push('/placeOrder');
	};

	useEffect(() => {
		if (!shippingAddress) {
			return router.push('shipping');
		}

		setSelectedPaymentMethod(paymentMethod || '');
	}, [paymentMethod, router, shippingAddress.address]);

	return (
		<form
			action=""
			className="mx-auto max-w-screen-md"
			onSubmit={submitHandler}
		>
			<h1 className="mb-4 text-xl">Payment Method</h1>
			{['PayPal', 'Strip', 'CashOnDelivery'].map(payment => (
				<div key={payment} className="mb-4">
					<input
						type="radio"
						name="paymentMethod"
						className="p-2 outline-none focus:ring-0"
						id={payment}
						checked={
							selectedPaymentMethod ===
							payment
						}
						onChange={() =>
							setSelectedPaymentMethod(
								payment
							)
						}
					/>
					<label
						htmlFor={payment}
						className="p-2"
					>
						{payment}
					</label>
				</div>
			))}

			<div className="mb-4 flex justify-between">
				<button
					className="default-button"
					type="button"
					onClick={() => router.push('/shipping')}
				>
					Back
				</button>
				<button className="primary-button">Next</button>
			</div>
		</form>
	);
}
