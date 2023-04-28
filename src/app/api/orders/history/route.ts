import db from '@/utils/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request, response: Response) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ message: 'signIn Required' },
			{
				status: 401
			}
		);
	}

	const { user } = session;

	await db.connect();

	const orders = await Order.find({
		user: user.id
	});

	await db.disconnect();

	return NextResponse.json(orders);
}
