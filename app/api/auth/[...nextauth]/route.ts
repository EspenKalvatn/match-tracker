import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/prisma/client';

export const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        // TODO: add validation:

        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        console.log('user', user);

        if (!user) return null;

        const isValidPassword = await compare(
          credentials?.password || '',
          user.password,
        );
        console.log('isvalidpassword', isValidPassword);

        if (isValidPassword) {
          return {
            id: user.id,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
