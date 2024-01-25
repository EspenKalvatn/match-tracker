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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(validation.error.errors, { status: 400 });

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 },
      );

    // TODO: hash password

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
