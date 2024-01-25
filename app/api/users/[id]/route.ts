import prisma from '../../../../prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });
    if (!user) {
      return NextResponse.json({ status: 404, error: 'Resource not found' });
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
    const user = await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
