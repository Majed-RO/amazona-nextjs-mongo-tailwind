import User from '@/models/User';
import db from '@/utils/db';
// import NextAuth from 'next-auth/next';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import bcryptjs from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user?.id) token.id = user.id;
			if (user?.isAdmin) token.isAdmin = user.isAdmin;
			return token;
		},
		async session({ session, token }) {
			if (token?.id) session.user.id = token.id;
			if (token?.isAdmin)
				session.user.isAdmin = token.isAdmin;
			return session;
		}
	},
	pages: {
		signIn: '/login'
		/* signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest) */
	},
	providers: [
		CredentialsProvider({
			// name: 'Sign in',
			credentials: {
				email: {
					label: 'Email',
					type: 'email',
					placeholder: 'hello@example.com'
				},
				password: {
					label: 'Password',
					type: 'password'
				}
			},
			async authorize(credentials) {
				if (
					!credentials?.email ||
					!credentials?.password
				) {
					return null;
				}
				await db.connect();
				const user = await User.findOne({
					email: credentials?.email
				});
				await db.disconnect();
				if (
					user &&
					bcryptjs.compareSync(
						credentials.password,
						user.password
					)
				) {
					return {
						id: user.id,
						// _id: user._id,
						name: user.name,
						email: user.email,
						image: 'f',
						isAdmin: user.isAdmin
					};
				}

				// return null;
				throw new Error('Invalid email or password!');
			}
		})
	]
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
