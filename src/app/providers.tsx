'use client';

import { StoreProvider } from '@/utils/store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import axios from 'axios';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Props = {
	children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
	console.log('in providers');
	const [paypalInitialOptions, setPaypalInitialOptions] = useState({
		'client-id': '',
		currency: 'USD'
	});

	useEffect(() => {
		axios.get('/api/keys/paypal')
			.then(function (response) {
				setPaypalInitialOptions(prevState => {
					return {
						...prevState,
						'client-id': response.data
					};
				});
			})
			.catch(error => {
				console.log('error', error);
			});
	}, []);

	return (
		<SessionProvider>
			<StoreProvider>
				<PayPalScriptProvider
					options={paypalInitialOptions}
					deferLoading={true}
				>
					{children}
				</PayPalScriptProvider>
			</StoreProvider>
		</SessionProvider>
	);
};
