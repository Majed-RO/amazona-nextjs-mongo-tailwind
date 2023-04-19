import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import OrderDetails from './components/OrderDetails';

export default async function OrderScreen({
	params
}: {
	params: { id: string };
}) {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect('/unauthorized?message=login required!');
	}

	const orderId = params.id;

	return (
		<div>
			<h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>

			<OrderDetails orderId={orderId} />
		</div>
	);
}
