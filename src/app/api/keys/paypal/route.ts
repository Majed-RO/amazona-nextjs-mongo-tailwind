import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
// import { getToken } from 'next-auth/jwt';

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ message: 'signIn Required' },
			{
				status: 401
			}
		);
	}

	return new NextResponse(process.env.PAYPAL_CLIENT_ID || 'sb');
}
