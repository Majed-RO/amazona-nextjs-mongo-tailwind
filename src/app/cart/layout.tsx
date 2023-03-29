export const metadata = {
	title: 'Amazona | Shopping Cart'
};

export default function CartLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return <section>{children}</section>;
}
