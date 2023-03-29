import NavBar from '@/components/NavBar';
import { StoreProvider } from '@/utils/store';
import Link from 'next/link';
import './globals.css';

export const metadata = {
	title: 'Amazona',
	description: 'An E-commerce website'
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<div className="flex min-h-screen flex-col justify-between">
          <StoreProvider>
					<header className=''>
						<NavBar />
					</header>
					<main className="container m-auto mt-4 px-4">
						{children}
					</main>
					<footer className='flex h-10 justify-center items-center shadow-inner'><p>Copyright &#169; 2022 Amazona</p></footer>
          </StoreProvider>
				</div>
			</body>
		</html>
	);
}
