import Product from '@/models/Product';
import db from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	context: {
		params: {
			id: string;
		};
	}
) {
	const { id } = context.params;
	await db.connect();
	const product = await Product.findById(id);
	await db.disconnect();

	return NextResponse.json(product);
}
