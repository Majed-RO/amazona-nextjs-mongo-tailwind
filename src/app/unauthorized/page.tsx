'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function Unauthorized() {
	const searchParams = useSearchParams();
	const message = searchParams.get('message');
	return (
		<div>
			<h1>Access Denied</h1>
			{message && (
				<div className="mb-4 text-red-500">
					{message}
				</div>
			)}
		</div>
	);
}
