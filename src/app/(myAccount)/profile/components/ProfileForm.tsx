'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { getError } from '@/utils/error';
import axios from 'axios';

interface FormData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const schema = yup.object().shape(
	{
		name: yup.string().required('Please enter name'),
		email: yup
			.string()
			.email('Email should be a valid Email!')
			.required('Please enter email'),
		password: yup.string().when('password', (val, schema) => {
			if (val[0]?.length > 0) {
				return yup
					.string()
					.min(
						6,
						'Password is more than 5 chars'
					);
			} else {
				return yup.string().optional();
			}
		}),
		confirmPassword: yup
			.string()
			.when(
				['password', 'confirmPassword'],
				(val, schema) => {
					const pass1 = val[0];
					const pass2 = val[1];

					if (pass1?.length > 0) {
						return yup
							.string()
							.min(
								6,
								'Confirm password is more than 5 chars'
							)
							.oneOf(
								[
									yup.ref(
										'password'
									)
								],
								'Your passwords do not match.'
							);
					} else {
						return yup
							.string()
							.notRequired();
					}
				}
			)
	},
	[
		['password', 'password'],
		['confirmPassword', 'confirmPassword']
	]
);

export default function ProfileForm() {
	const { data: session } = useSession();

	console.log('session', session);

	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
		getValues
	} = useForm<FormData>({ resolver: yupResolver(schema) });

	useEffect(() => {
		setValue('name', session?.user?.name || '');
		setValue('email', session?.user.email || '');
	}, [session?.user, setValue]);

	const submitHandler = async (data: FormData) => {
		const { name, email, password } = data;

		try {
			await axios.put('/api/auth/update', {
				name,
				email,
				password
			});
			toast.success('Profile updated successfully');

			if (password) {
				// signin again if password had changed
				const result = await signIn('credentials', {
					redirect: false,
					email,
					password
				});

				if (result?.error) {
					toast.error(result.error);
				}
			} else {
				signOut({ callbackUrl: '/login' });
			}
		} catch (error: any) {
			toast.error(getError(error));
		}
		// router.push('/payment');
	};

	return (
		<form
			className="mx-auto max-w-screen-md"
			onSubmit={handleSubmit(submitHandler)}
		>
			<h1 className="mb-4 text-xl">Update Profile</h1>

			<div className="mb-4">
				<label htmlFor="name">Name</label>
				<input
					{...register('name')}
					type="text"
					className="w-full"
					id="name"
					autoFocus
				/>

				{errors.name && (
					<div className="text-red-500">
						{errors.name?.message}
					</div>
				)}
			</div>

			<div className="mb-4">
				<label htmlFor="email">Email</label>
				<input
					{...register('email')}
					type="email"
					className="w-full"
					id="email"
				/>

				{errors.email && (
					<div className="text-red-500">
						{errors.email?.message}
					</div>
				)}
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

			<div className="mb-4 flex justify-between">
				<button className="primary-button">
					Update Profile
				</button>
			</div>
		</form>
	);
}
