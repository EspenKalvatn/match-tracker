import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/prisma/client';
import { createMatchSchema } from '@/app/validationSchemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createMatchSchema.safeParse(body);

    if (!validation.success)
      return NextResponse.json(validation.error.errors, { status: 400 });

    const newIssue = await prisma.match.create({
      data: {
        homeTeam: body.homeTeam,
        awayTeam: body.awayTeam,
        homeScore: body.homeScore,
        awayScore: body.awayScore,
        date: body.date,
        stadium: body.stadium,
        competition: body.competition,
        description: body.description,
      },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}

export async function GET() {
  try {
    const matches = await prisma.match.findMany();
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
