import Product from '@/models/Product';
import db from '@/utils/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import Order from '@/models/Order';

export async function POST(request: Request, response: Response) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return new Response('signIn Required', {
			status: 401
		});
	}

	// console.log("Session", JSON.stringify(session, null, 2))
	const { user } = session;

	const requestBody = await request.json();

	await db.connect();

	const newOrder = new Order({
		...requestBody,
		user: user.id
	});

	const order = await newOrder.save();

	await db.disconnect();

	return NextResponse.json(order);
}
