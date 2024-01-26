import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createUserSchema } from '@/app/validationSchemas';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
