import CheckoutWizard from '@/components/CheckoutWizard';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import PaymentForm from './components/PaymentForm';

export default async function PaymentScreen() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect('/unauthorized?message=login required!');
	}
	return (
		<div>
			<CheckoutWizard activeStep={2} />
			<PaymentForm />
		</div>
	);
}
