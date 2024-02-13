import React from 'react';
import { Avatar, Box, Flex, Text } from '@radix-ui/themes';
import { User } from '@/app/types/User';

const PostHeader: React.FC<{ user: User; createdAt: string }> = ({
  user,
  createdAt,
}) => (
  <Flex gap="5" align="center">
    <Avatar
      size="3"
      src={user.avatar}
      radius="full"
      color={user.avatarColor || 'green'}
      fallback={user.avatarInitials || user.name[0]}
    />
    <Box className="">
      <Text as="div" size="2" weight="bold">
        {user.name}
      </Text>
      <Text as="div" size="1" color="gray">
        {createdAt}
      </Text>
    </Box>
  </Flex>
);

export default PostHeader;
