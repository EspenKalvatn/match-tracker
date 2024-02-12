import React from 'react';
import { Avatar, Card, Flex, Text } from '@radix-ui/themes';
import OptionsMenu from './OptionsMenu';
import { Comment } from '@/app/types/Post';
import { getTimeAgo } from '@/app/utils/DateTimeHelper';

interface CommentProps {
  comment: Comment;
  sessionUserId: string | undefined;
  deleteComment: (commentId: string) => Promise<void>; // Correct the type here
}

const Comment: React.FC<CommentProps> = ({
  comment,
  sessionUserId,
  deleteComment,
}) => (
  <Flex key={comment.id} gap={'3'}>
    <Avatar
      size="2"
      src=""
      radius="full"
      color={comment.user.avatarColor || 'green'}
      fallback={comment.user.avatarInitials || comment.user.name[0]}
    />
    <Flex direction={'column'} className={'w-full'}>
      <Card>
        <Flex direction={'column'} gap="2">
          <Text size={'1'} color={'gray'}>
            {comment.user.name}
          </Text>
          <Text size={'2'}>{comment.content}</Text>
        </Flex>
      </Card>
      <Flex justify={'between'} align={'center'} className={'pl-2 pr-2'}>
        <Text size={'1'} color={'gray'}>
          {getTimeAgo(comment.createdAt)}
        </Text>
        <OptionsMenu
          userId={comment.userId}
          currentUserId={sessionUserId}
          onDelete={() => deleteComment(comment.id)}
        >
          Delete comment
        </OptionsMenu>
      </Flex>
    </Flex>
  </Flex>
);

export default Comment;
