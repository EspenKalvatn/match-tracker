import React from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { Match } from '@/app/types/Match';

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

const MatchDetails: React.FC<{ match: Match }> = ({ match }) => (
  <Flex gap="5" align="center">
    <Text as="div" size="2" color="gray">
      {new Date(match.date).toLocaleDateString('en-GB')}
    </Text>
    <Flex direction="column" className="flex-1">
      <TeamAndScore team={match.homeTeam} score={match.homeScore} />
      <TeamAndScore team={match.awayTeam} score={match.awayScore} />
    </Flex>
  </Flex>
);

export default MatchDetails;
