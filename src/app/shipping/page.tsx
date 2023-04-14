import CheckoutWizard from '@/components/CheckoutWizard';
import ShippingForm from './components/ShippingForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function ShippingScreen() {
	const session = await getServerSession(authOptions);
	console.log('session', session);
	console.log('ShippingScreen');
	if (!session) {
		console.log('not logged in');
		redirect('/unauthorized?message=login required!');
	}
	return (
		<div>
			<CheckoutWizard activeStep={1} />
			<ShippingForm />
		</div>
	);
}
