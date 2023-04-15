'use client';

import { Store } from '@/utils/store';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import Cookies from 'js-cookie';

export default function NavBar() {
	const { status, data: session } = useSession();

	console.log('session in navbar', session);

	const { state, dispatch } = useContext(Store);
	const { cart } = state;
	const [cartItemsCount, setCartItemsCount] = useState(0);

	useEffect(() => {
		setCartItemsCount(
			cart.cartItems.reduce((a, c) => a + c.quantity, 0)
		);
	}, [cart.cartItems]);

	const logoutClickHandler = () => {
		Cookies.remove('cart');
		dispatch({ type: 'CART_RESET' });
		signOut({ callbackUrl: '/login' });
	};

	return (
		<nav className="flex h-12 justify-between shadow items-center px-4">
			<Link href={'/'} className="text-lg font-bold">
				Amazona
			</Link>
			<div className="flex space-x-4">
				<Link href={'/cart'}>
					Cart
					<span className="ml-1 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
						{cartItemsCount}
					</span>
				</Link>
				{status === 'loading' ? (
					'loading'
				) : session?.user ? (
					<Menu
						as="div"
						className="relative inline-block"
					>
						<Menu.Button
							className={
								'text-blue-600'
							}
						>
							{session.user.name}
						</Menu.Button>
						<Menu.Items
							className={
								'absolute right-0 w-56 origin-top-right bg-white  shadow-lg'
							}
						>
							<Menu.Item>
								<Link
									href={
										'/profile'
									}
									className="dropdown-link"
								>
									Profile
								</Link>
							</Menu.Item>
							<Menu.Item>
								<Link
									href={
										'/profile'
									}
									className="dropdown-link"
								>
									Order
									History
								</Link>
							</Menu.Item>
							<Menu.Item>
								<a
									href={
										'#'
									}
									className="dropdown-link"
									onClick={
										logoutClickHandler
									}
								>
									Logout
								</a>
							</Menu.Item>
						</Menu.Items>
					</Menu>
				) : (
					<Link href={'/login'}>Login</Link>
				)}
			</div>
		</nav>
	);
}
