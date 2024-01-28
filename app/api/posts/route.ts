import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { createPostSchema } from '@/app/validationSchemas';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
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
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(validation.error.errors, { status: 400 });

    if (!body.userId || !body.matchId) {
      return NextResponse.json(
        { error: 'User ID or Match ID is missing' },
        { status: 400 },
      );
    }
    const newPost = await prisma.post.create({
      data: {
        content: body.content,
        likes: body.likes,
        comments: body.comments,
        userId: body.userId,
        matchId: body.matchId,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
