import { z } from 'zod';

export const createMatchSchema = z.object({
  homeTeam: z.string().min(1).max(255),
  awayTeam: z.string().min(1).max(255),
  homeScore: z.number().min(0).max(100),
  awayScore: z.number().min(0).max(100),
  date: z
    .string()
    .refine((arg) =>
      arg.match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/,
      ),
    ),
  stadium: z.string().min(1).max(255),
  competition: z.string().min(1).max(255),
  description: z.string().optional(),
});
