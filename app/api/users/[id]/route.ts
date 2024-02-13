import prisma from '../../../../prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { updateUserSchema } from '@/app/validationSchemas';
import { hash } from 'bcrypt';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 },
      );
    }
    if (user.id !== session?.user.id && session?.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You are not authorized to view this resource' },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: { id: string };
  },
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 },
      );
    }

    if (user.id !== session?.user.id && session?.user.role !== 'admin') {
      return NextResponse.json(
        {
          error: 'You are not authorized to update this resource',
        },
        {
          status: 401,
        },
      );
    }

    // Check if email is already in use
    if (body.email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (existingEmail && existingEmail.id !== user.id) {
        return NextResponse.json(
          {
            error: 'Email already in use',
          },
          {
            status: 400,
          },
        );
      }
    }

    // Update password if provided
    let updatedPassword = null;
    if (body.password) {
      updatedPassword = await hash(body.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        email: body.email,
        ...(body.avatarInitials && { avatarInitials: body.avatarInitials }),
        ...(body.avatarColor && { avatarColor: body.avatarColor }),
        ...(updatedPassword && { password: updatedPassword }),
        ...(session?.user.role === 'admin' && { role: body.role }), // Only admin can update role
      },
    });

    const { password, ...rest } = updatedUser;
    return NextResponse.json(rest, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 },
      );
    }

    if (user.id !== session?.user.id && session?.user.role !== 'admin') {
      return NextResponse.json(
        {
          error: 'You are not authorized to delete this resource',
        },
        {
          status: 401,
        },
      );
    }

    const results = await prisma.$transaction([
      prisma.like.deleteMany({
        where: {
          userId: params.id,
        },
      }),
      prisma.comment.deleteMany({
        where: {
          userId: params.id,
        },
      }),
      prisma.post.deleteMany({
        where: {
          userId: params.id,
        },
      }),
      prisma.user.delete({
        where: {
          id: params.id,
        },
      }),
    ]);

    return NextResponse.json(results, {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
