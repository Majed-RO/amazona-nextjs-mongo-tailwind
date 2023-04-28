import React from 'react';
import OrdersList from './components/OrdersList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function OrderHistoryScreen() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect('/unauthorized?message=login required!');
	}

	return (
		<div>
			<h1 className="mb-4 text-xl">Order History</h1>
			<OrdersList />
		</div>
	);
}
