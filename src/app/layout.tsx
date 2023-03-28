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
					<header className=''>
						<nav className="flex h-12 justify-between shadow items-center px-4">
							<Link
								href={'/'}
								className="text-lg font-bold"
							>
								Amazona
							</Link>
							<div className="flex space-x-4">
								<Link
									href={
										'/cart'
									}
								>
									Cart
								</Link>
								<Link
									href={
										'/login'
									}
								>
									Login
								</Link>
							</div>
						</nav>
					</header>
					<main className="container m-auto mt-4 px-4">
						{children}
					</main>
					<footer className='flex h-10 justify-center items-center shadow-inner'><p>Copyright &#169; 2022 Amazona</p></footer>
				</div>
			</body>
		</html>
	);
}
