// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { getServerSession } from 'next-auth';
// import React, { use, useState } from 'react';
// import { authOptions } from '../api/auth/[...nextauth]/route';
// import { redirect } from 'next/navigation';

import TestClientComponent from './test';

export default async function Dashboard() {
	console.log('dashboard');
	/* const session = await getServerSession(authOptions);

	if (!session) {
		redirect('/login');
	} */

	// const router = useRouter();

	/* const { status } = useSession({
		required: true,
		onUnauthenticated() {
			console.log('not login in');
			router.push('/unauthorized?message=login required!');
		}
	}); */

	// const { data: session, status } = useSession();
	// const loading = status === 'loading';

	// if (status === 'loading') return <div>...loading</div>;
	// console.log('session', session);

	return (
		<div>
			<h1>Dashboard</h1>
			<TestClientComponent />
		</div>
	);
}
