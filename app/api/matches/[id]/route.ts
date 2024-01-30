import prisma from '../../../../prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const match = await prisma.match.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    if (!match) {
      return NextResponse.json({ status: 404, error: 'Resource not found' });
    }

    return NextResponse.json(match, { status: 200 });
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const match = await prisma.match.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      status: 200,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
