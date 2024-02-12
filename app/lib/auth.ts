import { NextAuthOptions } from 'next-auth';
import prisma from '@/prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/new-user',
  },
  callbacks: {
    async jwt({ token, user }) {
      const email = token.email || '';
      const dbUser = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (dbUser) {
        token.user = {
          ...user,
          id: dbUser?.id,
          email: dbUser?.email,
          name: dbUser?.name,
          role: dbUser?.role,
          avatarColor: dbUser?.avatarColor,
          avatarInitials: dbUser?.avatarInitials,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        console.log('credentials', credentials);
        // TODO: add validation:

        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) return null;

        const isValidPassword = await compare(
          credentials?.password || '',
          user.password,
        );

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
};
