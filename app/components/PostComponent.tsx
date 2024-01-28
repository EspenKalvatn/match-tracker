import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Popover,
  Separator,
  Text,
  TextArea,
} from '@radix-ui/themes';
import { AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { IoMdFootball } from 'react-icons/io';
import { Post } from '@/app/types/Post';

import { formatDistanceToNow, parseISO } from 'date-fns';
import { gray } from '@radix-ui/colors';
import { useSession } from 'next-auth/react';

// Function to calculate the time difference
const getTimeAgo = (createdAt: string): string => {
  const createdAtDate = parseISO(createdAt);
  return formatDistanceToNow(createdAtDate, { addSuffix: true });
};

const PostComponent: React.FC<{ post: Post }> = ({ post }) => {
  const session = useSession();
  const user = session.data?.user;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes.map((like) => like.userId).includes(user?.id),
  );

  const handleLike = async () => {
    if (isLiked) {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsLiked(false);
    } else {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        setIsLiked(true);
      }
    }
  };

  const comments = [
    {
      'comment:': 'Great match!',
    },
    {
      'comment:': 'Nice!',
    },
    {
      'comment:': 'Fantastic atmosphere!',
    },
  ];

  return (
    <Card style={{ width: 500 }} className={'p-4'}>
      <Flex gap="3" direction="column">
        <Flex gap="5" align="center">
          <Avatar
            size="3"
            src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
            radius="full"
            fallback="T"
          />
          <Box className="">
            <Text as="div" size="2" weight="bold">
              {post.user.name}
            </Text>
            <Text as="div" size="1" color="gray">
              {getTimeAgo(post.createdAt)}
            </Text>
          </Box>
        </Flex>

        <Flex gap="5" align="center">
          <Text as="div" size="2" color="gray">
            {new Date(post.match.date).toLocaleDateString('en-GB')}
          </Text>

          <Flex direction="column" className="flex-1">
            <TeamAndScore
              team={post.match.homeTeam}
              score={post.match.homeScore}
            />
            <TeamAndScore
              team={post.match.awayTeam}
              score={post.match.awayScore}
            />
          </Flex>
        </Flex>

        <Flex gap="5" align="center">
          <Flex direction="column" className="flex-1">
            <Text as="div" size="1" color="gray">
              Competition
            </Text>
            <Text as="div" size="2">
              {post.match.competition}
            </Text>
          </Flex>
          <Flex direction="column" className="flex-1">
            <Text as="div" size="1" color="gray">
              Ground name
            </Text>
            <Text as="div" size="2">
              {post.match.stadium}
            </Text>
          </Flex>
        </Flex>
        <Text as="div" size="2" className={'pt-5'}>
          {post.content}
        </Text>

        <Flex align="stretch" justify="between" className="">
          <Popover.Root>
            <Popover.Trigger>
              <Text color={'gray'} size={'1'}>
                {post.likes.length} likes
              </Text>
            </Popover.Trigger>
            <Popover.Content>
              <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
                {post.likes.map((like) => (
                  <div key={like.id}>
                    <Text as="div" size="1" color="gray">
                      {like.user.name}
                    </Text>
                  </div>
                ))}
              </Flex>
            </Popover.Content>
          </Popover.Root>

          <Popover.Root>
            <Popover.Trigger>
              <Text color={'gray'} size={'1'}>
                {post.comments.length} comments
              </Text>
            </Popover.Trigger>
            <Popover.Content>TODO</Popover.Content>
          </Popover.Root>
        </Flex>

        <Separator my="0" size="4" />

        <Flex align="stretch" justify="between" className="">
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
      </Flex>

      {isExpanded && (
        <div>
          <Separator my="3" size="4" />
          <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
            {post.comments.map((comment, index) => (
              <div key={index}>
                <Text as="div" size="1" color="gray">
                  {/*{comment.content}*/}
                </Text>
              </div>
            ))}
          </Flex>
          <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
            <TextArea size="2" placeholder="Reply to comment…" />
          </Flex>
        </div>
      )}
    </Card>
  );
};
export default PostComponent;

const TeamAndScore: React.FC<{ team: string; score: number }> = ({
  team,
  score,
}) => {
  return (
    <Flex justify="between">
      <Flex gap="2" align="center">
        {/*<IoMdFootball />*/}
        <Text as="div" size="3">
          {team}
        </Text>
      </Flex>
      <Text as="div" size="3">
        {score}
      </Text>
    </Flex>
  );
};
