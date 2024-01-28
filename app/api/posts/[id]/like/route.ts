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

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
      include: {
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const likes = post?.likes || [];

    if (likes.map((like) => like.userId).includes(session?.user.id)) {
      return NextResponse.json('Like already exists', { status: 403 });
    }

    const newLike = await prisma.like.create({
      data: {
        userId: session?.user.id,
        postId: params.id,
      },
    });

    console.log('like created:', newLike);

    return NextResponse.json(newLike, { status: 201 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
