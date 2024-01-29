import React from 'react';
import { Button, Flex, Text } from '@radix-ui/themes';
import { AiOutlineLike, AiOutlineComment } from 'react-icons/ai';

interface PostActionsProps {
  handleLike: () => void;
  isLiked: boolean;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const PostActions: React.FC<PostActionsProps> = ({
  handleLike,
  isLiked,
  isExpanded,
  setIsExpanded,
}) => (
  <Flex align="stretch" justify="between" className="">
    {/* Like Button */}
    <Button
      variant="ghost"
      color={isLiked ? 'blue' : 'gray'}
      size="3"
      onClick={handleLike}
    >
      <AiOutlineLike />
      <Text as="div" size="1">
        Like
      </Text>
    </Button>

    {/* Comment Button */}
    <Button
      variant="ghost"
      color="gray"
      size="3"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <AiOutlineComment />
      <Text as="div" size="1">
        Comment
      </Text>
    </Button>
  </Flex>
);

export default PostActions;
