import React from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { Post } from '@/app/types/Post';

const TeamAndScore: React.FC<{ team: string; score: number }> = ({
  team,
  score,
}) => (
  <Flex justify="between">
    <Flex gap="2" align="center">
      <Text as="div" size="3">
        {team}
      </Text>
    </Flex>
    <Text as="div" size="3">
      {score}
    </Text>
  </Flex>
);

const MatchDetails: React.FC<{ post: Post }> = ({ post }) => (
  <Flex gap="5" align="center">
    <Text as="div" size="2" color="gray">
      {new Date(post.match.date).toLocaleDateString('en-GB')}
    </Text>
    <Flex direction="column" className="flex-1">
      <TeamAndScore team={post.match.homeTeam} score={post.match.homeScore} />
      <TeamAndScore team={post.match.awayTeam} score={post.match.awayScore} />
    </Flex>
  </Flex>
);

export default MatchDetails;
