import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import { CredentialsProvider } from 'next-auth/providers/credentials';

import { DefaultSession, DefaultUser } from 'next-auth';

/* 
https://reacthustle.com/blog/extend-user-session-nextauth-typescript
*/

interface IUser extends DefaultUser {
	// _id: string;
	isAdmin: boolean;
}

declare module 'next-auth' {
	interface User extends IUser {}
	interface Session {
		user: User;
	}
}
declare module 'next-auth/jwt' {
	interface JWT extends IUser {}
}
