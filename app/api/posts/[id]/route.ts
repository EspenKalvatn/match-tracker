import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/prisma/client';

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

    const deletedPost = await prisma.post.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(deletedPost, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
