import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import ProfileForm from './components/ProfileForm';

export default async function ProfileScreen() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect('/unauthorized?message=login required!');
	}
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">My Profile</h1>
			<ProfileForm />
		</div>
	);
}
