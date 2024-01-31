import React from 'react';
import { Match } from '@/app/types/Match';
import { Flex, Text } from '@radix-ui/themes';

const AdditionalMatchDetails: React.FC<{ match: Match }> = ({ match }) => (
  <Flex gap="5" align="center">
    <Flex direction="column" className="flex-1">
      <Text as="div" size="1" color="gray">
        Competition
      </Text>
      <Text as="div" size="2">
        {match.competition}
      </Text>
    </Flex>
    <Flex direction="column" className="flex-1">
      <Text as="div" size="1" color="gray">
        Ground name
      </Text>
      <Text as="div" size="2">
        {match.stadium}
      </Text>
    </Flex>
  </Flex>
);

export default AdditionalMatchDetails;
