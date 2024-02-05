export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  stadium: string;
  competition: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceholderMatch {
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  date: string;
  stadium: string;
  competition: string;
}
