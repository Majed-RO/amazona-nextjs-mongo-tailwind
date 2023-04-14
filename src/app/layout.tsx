import NavBar from '@/components/NavBar';

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { Providers } from './providers';
import Toast from '@/components/toastContainer';

export const metadata = {
	title: 'Amazona',
	description: 'An E-commerce website'
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Toast />

				<div className="flex min-h-screen flex-col justify-between">
					<Providers>
						<header className="">
							<NavBar />
						</header>
						<main className="container m-auto mt-4 px-4">
							{children}
						</main>
						<footer className="flex h-10 justify-center items-center shadow-inner">
							<p>
								Copyright &#169;
								2022 Amazona
							</p>
						</footer>
					</Providers>
				</div>
			</body>
		</html>
	);
}

/* function Auth({children}) {
  const router = useRouter();
  const {status} = useSession({
    required: true,
    onUnauthenticated(){
      router.push('/unauthorized?message=login required')
    }
  })

  if(status === 'loading') {
    return <div>Loading...</div>
  }
  return children
} */
