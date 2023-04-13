'use client';

import { StoreProvider } from '@/utils/store';
import { SessionProvider } from 'next-auth/react';

type Props = {
	children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
	return (
		<SessionProvider>
			<StoreProvider>{children}</StoreProvider>
		</SessionProvider>
	);
};
