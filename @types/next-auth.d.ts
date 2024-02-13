import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      email: string;
      name: string;
      role: string;
      avatarColor: string;
      avatarInitials: string;
    };
  }
}
