import { User } from '@/app/types/User';
import { Match } from '@/app/types/Match';

export interface Post {
  id: string;
  content: string;
  likes: Like[];
  comments: Comment[];
  userId: string;
  user: User;
  matchId: string;
  match: Match;
  createdAt: string;
  updatedAt: string;
}

interface Like {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}
