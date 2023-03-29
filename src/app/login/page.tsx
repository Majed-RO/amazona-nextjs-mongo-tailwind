'use client';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface FormData {
	email: string;
	password: string;
}

const schema = yup
	.object({
		email: yup
			.string()
			.email('Email should be a valid Email!')
			.required('Please enter email'),
		password: yup
			.string()
			.min(6, 'Password is more than 5 chars')
			.required('Please enter password')
	})
	.required();

export default function LoginScreen() {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>({ resolver: yupResolver(schema) });

	const submitHandler = handleSubmit(data => {
		console.log('data', data);
		const { email, password } = data;
	});
	return (
		<form
			action=""
			className="mx-auto max-w-screen-md"
			onSubmit={submitHandler}
		>
			<h1 className="mb-4 text-xl">Login</h1>
			<div className="mb-4">
				<label htmlFor="email">Email</label>
				<input
					{...register('email')}
					type="email"
					className="w-full"
					id="email"
					autoFocus
				/>

				<div className="text-red-500">
					{errors.email?.message}
				</div>
			</div>
			<div className="mb-4">
				<label htmlFor="password">Password</label>
				<input
					{...register('password')}
					type="password"
					className="w-full"
					id="password"
					autoComplete="new-password"

				/>
				<div className="text-red-500">
					{errors.password?.message}
				</div>
			</div>
			<div className="mb-4">
				<button className="primary-button">
					Login
				</button>
			</div>
			<div className="mb-4">
				Don&rsquo;t have an account? &nbsp;
				<Link href={'/register'}>Register</Link>
			</div>
		</form>
	);
}
