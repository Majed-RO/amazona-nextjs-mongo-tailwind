'use client';
import React from 'react';
import { useSession } from 'next-auth/react';

export default function TestClientComponent() {
	console.log('client component tets');

	const { data: session, status } = useSession();

	if (status === 'loading') return <div>...loading</div>;

	return <div>TestClientComponent22</div>;
}
