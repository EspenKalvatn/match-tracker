import prisma from '../../../../prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

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
      return NextResponse.json({ status: 404, error: 'Resource not found' });
    }
    if (user.id !== session?.user.id && session?.user.role !== 'admin') {
      return NextResponse.json({
        status: 401,
        error: 'You are not authorized to view this resource',
      });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
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
      return NextResponse.json({ status: 404, error: 'Resource not found' });
    }

    if (user.id !== session?.user.id && session?.user.role !== 'admin') {
      return NextResponse.json({
        status: 401,
        error: 'You are not authorized to delete this resource',
      });
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
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
