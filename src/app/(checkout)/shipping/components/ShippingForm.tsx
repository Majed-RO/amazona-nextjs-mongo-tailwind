'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Store } from '@/utils/store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

interface FormData {
	fullName: string;
	address: string;
	city: string;
	postalCode: string;
	country: string;
}

const schema = yup
	.object({
		fullName: yup.string().required('Please enter full name'),
		address: yup
			.string()
			.required('Please enter address')
			.min(3, 'Address is more than 2 chars'),
		city: yup.string().required('Please enter city'),
		postalCode: yup.string().required('Please enter postal code'),
		country: yup.string().required('Please enter country')
	})
	.required();

export default function ShippingForm() {
	const { state, dispatch } = useContext(Store);

	const { cart } = state;
	const { shippingAddress } = cart;

	const router = useRouter();

	useEffect(() => {
		setValue('fullName', shippingAddress.fullName);
		setValue('address', shippingAddress.address);
		setValue('city', shippingAddress.city);
		setValue('postalCode', shippingAddress.postalCode);
		setValue('country', shippingAddress.country);
	}, [shippingAddress]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues
	} = useForm<FormData>({ resolver: yupResolver(schema) });

	const submitHandler = async (data: FormData) => {
		const { fullName, address, city, country, postalCode } = data;

		dispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: {
				fullName,
				address,
				city,
				postalCode,
				country
			}
		});

		Cookies.set(
			'cart',
			JSON.stringify({
				...state.cart,
				shippingAddress: {
					fullName,
					address,
					city,
					postalCode,
					country
				}
			})
		);
		router.push('/payment');
	};
	return (
		<form
			action=""
			className="mx-auto max-w-screen-md"
			onSubmit={handleSubmit(submitHandler)}
		>
			<h1 className="mb-4 text-xl">Shipping Address</h1>

			<div className="mb-4">
				<label htmlFor="fullName">Full Name</label>
				<input
					{...register('fullName')}
					type="text"
					className="w-full"
					id="fullName"
					autoFocus
				/>

				{errors.fullName && (
					<div className="text-red-500">
						{errors.fullName?.message}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label htmlFor="address">Address</label>
				<input
					{...register('address')}
					type="text"
					className="w-full"
					id="address"
				/>

				{errors.address && (
					<div className="text-red-500">
						{errors.address?.message}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label htmlFor="city">City</label>
				<input
					{...register('city')}
					type="text"
					className="w-full"
					id="city"
				/>

				{errors.city && (
					<div className="text-red-500">
						{errors.city?.message}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label htmlFor="postalCode">PostalCode</label>
				<input
					{...register('postalCode')}
					type="text"
					className="w-full"
					id="postalCode"
				/>

				{errors.postalCode && (
					<div className="text-red-500">
						{errors.postalCode?.message}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label htmlFor="country">Country</label>
				<input
					{...register('country')}
					type="text"
					className="w-full"
					id="country"
				/>

				{errors.country && (
					<div className="text-red-500">
						{errors.country?.message}
					</div>
				)}
			</div>
			<div className="mb-4 flex justify-between">
				<button className="primary-button">Next</button>
			</div>
		</form>
	);
}
