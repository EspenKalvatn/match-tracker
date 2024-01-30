import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { createMatchSchema } from '@/app/validationSchemas';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createMatchSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(validation.error.errors, { status: 400 });

    const match = await prisma.match.create({
      data: {
        homeTeam: body.homeTeam,
        awayTeam: body.awayTeam,
        homeScore: body.homeScore,
        awayScore: body.awayScore,
        date: body.date,
        stadium: body.stadium,
        competition: body.competition,
        userId: body.userId,
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  try {
    const isAdmin = session?.user.role === 'ADMIN';
    const matches = await prisma.match.findMany({
      where: {
        ...(isAdmin ? {} : { userId: session?.user.id }),
      },
    });
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
