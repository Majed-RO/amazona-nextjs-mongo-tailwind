'use client';
import { Store } from '@/utils/store';
import Link from 'next/link';
import React, { useContext } from 'react';

export default function NavBar() {
	const { state } = useContext(Store);
	const { cart } = state;
	return (
		<nav className="flex h-12 justify-between shadow items-center px-4">
			<Link href={'/'} className="text-lg font-bold">
				Amazona
			</Link>
			<div className="flex space-x-4">
				<Link href={'/cart'}>
					Cart
					<span className="ml-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
						{cart.cartItems.reduce(
							(a, c) =>
								a + c.quantity,
							0
						)}
					</span>
				</Link>
				<Link href={'/login'}>Login</Link>
			</div>
		</nav>
	);
}
