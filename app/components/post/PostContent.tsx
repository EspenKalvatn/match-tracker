import React from 'react';
import { Text } from '@radix-ui/themes';

const PostContent: React.FC<{ content: string }> = ({ content }) => (
  <Text as="div" size="2" className={'pt-5'}>
    {content}
  </Text>
);

export default PostContent;
