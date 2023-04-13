'use client';

import { ToastContainer } from 'react-toastify';

export default function Toast() {
	return (
		<div>
			<ToastContainer position="bottom-center" limit={1} />
		</div>
	);
}
