import CheckoutWizard from '@/components/CheckoutWizard';
import Link from 'next/link';
import React from 'react';
import OrderDetails from './components/OrderDetails';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function PlaceOrderScreen() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect('/unauthorized?message=login required!');
	}
	return (
		<div>
			<CheckoutWizard activeStep={3} />
			<h1 className="mb-4 text-xl">Place Order</h1>
			<OrderDetails />
		</div>
	);
}
