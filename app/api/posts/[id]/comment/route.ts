import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import prisma from '@/prisma/client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    const body = await request.json();

    const content = body.content;

    if (!content) {
      return NextResponse.json('Content is required', { status: 403 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content,
        userId: session?.user.id,
        postId: params.id,
      },
    });

    return NextResponse.json(comment, { status: 201 });
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
    const body = await request.json();
    const commentId = body.commentId;

    if (!commentId) {
      return NextResponse.json('CommentId is required', { status: 403 });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return NextResponse.json('Comment not found', { status: 404 });
    }

    if (comment.userId !== session?.user.id) {
      return NextResponse.json('Unauthorized', { status: 401 });
    }

    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json(deletedComment, { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
