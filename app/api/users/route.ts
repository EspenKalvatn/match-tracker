import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user.role === 'ADMIN';
    if (!isAdmin) {
      return NextResponse.json({ status: 403, error: 'Forbidden' });
    }
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
