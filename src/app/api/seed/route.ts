import User from '@/models/User';
import data from '@/utils/data';
import db from '@/utils/db';

export async function GET(request: Request) {
	await db.connect();
	await User.deleteMany();
	await User.insertMany(data.users);

	await db.disconnect();
	return new Response('seeded successfully!');
}
