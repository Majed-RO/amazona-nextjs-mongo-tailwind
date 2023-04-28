import React from 'react';

export default function Unauthorized({
	searchParams
}: {
	searchParams: { message: string };
}) {
	return (
		<div>
			<h1>Access Denied</h1>
			{searchParams?.message && (
				<div className="mb-4 text-red-500">
					{searchParams?.message}
				</div>
			)}
		</div>
	);
}
