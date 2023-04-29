import db from '@/utils/db';
import { NextResponse } from 'next/server';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export async function PUT(request: Request, response: Response) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ message: 'signIn Required' },
			{ status: 401 }
		);
	}

	const { user } = session;

	const requestBody = await request.json();

	const { name, email, password } = requestBody;

	if (
		!name ||
		!email ||
		!email.includes('@') ||
		(password && password.trim().length < 5)
	) {
		return NextResponse.json(
			{ message: 'Validation error' },
			{ status: 422 }
		);
	}

	await db.connect();

	const toUpdateUser = await User.findById(user.id);

	toUpdateUser.name = name;
	toUpdateUser.email = email;

	if (password) {
		toUpdateUser.password = bcryptjs.hashSync(password);
	}

	await toUpdateUser.save();

	await db.disconnect();

	return NextResponse.json({
		message: 'User updated!'
	});
}
