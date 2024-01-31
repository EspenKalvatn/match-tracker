// Function to calculate the time difference
import { formatDistanceToNow, parseISO } from 'date-fns';

export const getTimeAgo = (createdAt: string): string => {
  const createdAtDate = parseISO(createdAt);
  return formatDistanceToNow(createdAtDate, { addSuffix: true });
};
