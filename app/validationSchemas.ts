import { z } from 'zod';

// TODO: Add proper validation
export const createMatchSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  homeScore: z.number().min(0).max(100),
  awayScore: z.number().min(0).max(100),
  date: z
    .string()
    .refine((arg) =>
      arg.match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/,
      ),
    ),
  stadium: z.string().min(1),
  competition: z.string().min(1),
});

// TODO: Add proper validation
export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

// TODO: Add proper validation
export const createPostSchema = z.object({
  content: z.string(),
  likes: z.array(z.string()),
  comments: z.array(z.string()),
  userId: z.string(),
  matchId: z.string(),
});
