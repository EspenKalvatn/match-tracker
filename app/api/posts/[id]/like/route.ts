import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // const body = await request.json();
    const session = await getServerSession(authOptions);

    const likes = await prisma.like.findMany({
      where: {
        postId: params.id,
      },
    });

    if (likes.map((like) => like.userId).includes(session?.user.id)) {
      return NextResponse.json('Like already exists', { status: 403 });
    }

    const newLike = await prisma.like.create({
      data: {
        userId: session?.user.id,
        postId: params.id,
      },
    });

    return NextResponse.json(newLike, { status: 201 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    const likes = await prisma.like.findMany({
      where: {
        postId: params.id,
      },
    });

    const userLike = likes.find((like) => like.userId === session?.user.id);

    if (!userLike) {
      return NextResponse.json('Like does not exist', { status: 403 });
    }

    const deletedLike = await prisma.like.delete({
      where: {
        id: userLike.id,
      },
    });

    return NextResponse.json(deletedLike, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
