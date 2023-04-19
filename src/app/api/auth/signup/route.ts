import db from '@/utils/db';
import { NextResponse } from 'next/server';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

export async function POST(request: Request, response: Response) {
	const requestBody = await request.json();

	const { name, email, password } = requestBody;

	if (
		!name ||
		!email ||
		!email.includes('@') ||
		!password ||
		password.trim().length < 5
	) {
		return NextResponse.json(
			{ message: 'Validation error' },
			{ status: 422 }
		);
	}

	await db.connect();

	const existingUser = await User.findOne({ email });

	if (existingUser) {
		await db.disconnect();
		return NextResponse.json(
			{ message: 'User exist already' },
			{ status: 422 }
		);
	}

	const newUser = new User({
		name,
		email,
		password: bcryptjs.hashSync(password),
		isAdmin: false
	});

	const user = await newUser.save();
	await db.disconnect();

	return NextResponse.json({
		message: 'Created user!',
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin
	});
}
