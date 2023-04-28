import db from '@/utils/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import Order from '@/models/Order';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
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

	const requestBody = await request.json();

	await db.connect();

	const order = await Order.findById(id);

	if (order) {
		if (order.isPaid) {
			return NextResponse.json(
				{ message: 'Error: order is already paid!' },
				{
					status: 400
				}
			);
		}

		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id,
			status: requestBody.status,
			email_address: requestBody.email_address
		};
		const paidOrder = await order.save();
		await db.disconnect();

		return NextResponse.json({
			message: 'order paid successfully',
			order: paidOrder
		});
	} else {
		await db.disconnect();

		return NextResponse.json(
			{ message: 'Error: order not found!' },
			{
				status: 400
			}
		);
	}
}
