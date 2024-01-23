import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/prisma/client';

const createMatchSchema = z.object({
  homeTeam: z.string().min(1).max(255),
  awayTeam: z.string().min(1).max(255),
  homeScore: z.number().min(0).max(100),
  awayScore: z.number().min(0).max(100),
  date: z.string(),
  stadium: z.string().min(1).max(255),
  competition: z.string().min(1).max(255),
  description: z.string().min(0),
});

export async function POST(request: NextRequest) {
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
}
