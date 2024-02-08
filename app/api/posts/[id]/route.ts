import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
      include: {
        match: true,
        user: {
          select: {
            name: true,
            id: true,
          },
        },
        likes: {
          include: {
            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json('Post not found', { status: 404 });
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('Error fetching post:', error);
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

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!post) {
      return NextResponse.json('Post not found', { status: 404 });
    }

    if (post.userId !== session?.user.id) {
      return NextResponse.json('Unauthorized', { status: 401 });
    }

    const result = await prisma.$transaction([
      prisma.comment.deleteMany({
        where: {
          postId: params.id,
        },
      }),
      prisma.like.deleteMany({
        where: {
          postId: params.id,
        },
      }),
      prisma.post.delete({
        where: {
          id: params.id,
        },
      }),
    ]);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
