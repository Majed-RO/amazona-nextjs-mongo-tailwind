'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { signIn, useSession } from 'next-auth/react';
import { getError } from '@/utils/error';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

interface FormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const schema = yup.object({
	email: yup
		.string()
		.email('Email should be a valid Email!')
		.required('Please enter email'),
	name: yup.string().required('Please enter name'),
	password: yup
		.string()
		.min(6, 'Password is more than 5 chars')
		.required('Please enter password'),
	confirmPassword: yup
		.string()
		.min(6, 'Confirm password is more than 5 chars')
		.required('Please enter confirm password')
		.oneOf([yup.ref('password')], 'Your passwords do not match.')
	// .test(value=> value === getValues('password'))
});
// .required();

export default function RegisterScreen() {
	const { data: session } = useSession();

	const searchParams = useSearchParams();
	const redirect = searchParams.get('redirect');

	console.log('redirect==', redirect);

	const router = useRouter();

	useEffect(() => {
		if (session?.user) {
			router.push(redirect || '/');
		}
	}, [router, session, redirect]);

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>({ resolver: yupResolver(schema) });

	const submitHandler = async (data: {
		name: string;
		email: string;
		password: string;
	}) => {
		const { name, email, password } = data;

		try {
			await axios.post(`/api/auth/signup`, {
				name,
				email,
				password
			});

			const result = await signIn('credentials', {
				redirect: false,
				email,
				password
			});
			if (result?.error) {
				toast.error(result.error);
			}
		} catch (error: any) {
			toast.error(getError(error));
		}
	};

	return (
		<form
			action=""
			className="mx-auto max-w-screen-md"
			onSubmit={handleSubmit(submitHandler)}
		>
			<h1 className="mb-4 text-xl">Create Account</h1>

			<div className="mb-4">
				<label htmlFor="name">Name</label>
				<input
					{...register('name')}
					type="text"
					className="w-full"
					id="name"
					autoFocus
				/>

				<div className="text-red-500">
					{errors.name?.message}
				</div>
			</div>

			<div className="mb-4">
				<label htmlFor="email">Email</label>
				<input
					{...register('email')}
					type="email"
					className="w-full"
					id="email"
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
				<label htmlFor="confirmPassword">
					Confirm Password
				</label>
				<input
					{...register('confirmPassword')}
					type="password"
					className="w-full"
					id="confirmPassword"
					autoComplete="new-password"
				/>
				<div className="text-red-500">
					{errors.confirmPassword?.message}
				</div>
			</div>

			<div className="mb-4">
				<button className="primary-button">
					Register
				</button>
			</div>
			<div className="mb-4">
				Don&rsquo;t have an account? &nbsp;
				<Link
					href={`/register?redirect=${
						redirect || '/'
					}`}
				>
					Register
				</Link>
			</div>
		</form>
	);
}
