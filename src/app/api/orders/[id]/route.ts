import db from '@/utils/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import Order from '@/models/Order';

export async function GET(
	request: Request,
	context: {
		params: {
			id: string;
		};
	}
) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new Response('signIn Required', {
			status: 401
		});
	}

	const { id } = context.params;

	await db.connect();

	const order = await Order.findById(id);

	await db.disconnect();

	return NextResponse.json(order);
}
