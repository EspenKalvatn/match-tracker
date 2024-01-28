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
  TextField,
} from '@radix-ui/themes';
import { AiOutlineComment, AiOutlineLike } from 'react-icons/ai';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

import { AiOutlineSend } from 'react-icons/ai';
import { Post } from '@/app/types/Post';
import { createCommentSchema, createUserSchema } from '@/app/validationSchemas';

import { formatDistanceToNow, parseISO } from 'date-fns';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

// Function to calculate the time difference
const getTimeAgo = (createdAt: string): string => {
  const createdAtDate = parseISO(createdAt);
  return formatDistanceToNow(createdAtDate, { addSuffix: true });
};

type CommentForm = z.infer<typeof createCommentSchema>;

const PostComponent: React.FC<{ post: Post }> = ({ post }) => {
  const router = useRouter();
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
    location.reload();
  };

  const deleteComment = (commentId: string) => async () => {
    const res = await fetch(`/api/posts/${post.id}/comment/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentId }),
    });
    location.reload();
  };

  const deletePost = (postId: string) => async () => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    location.reload();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentForm>({
    resolver: zodResolver(createCommentSchema),
  });

  const addComment = async (content: string) => {
    const res = await fetch(`/api/posts/${post.id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    // TODO: Maybe refresh page?
  };

  return (
    <Card style={{ width: 500 }} className={'p-4'}>
      <Flex gap="3" direction="column">
        <Flex justify={'between'}>
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
          <Popover.Root>
            <Popover.Trigger>
              <Button variant="ghost" color={'gray'}>
                <HiOutlineDotsHorizontal />
              </Button>
            </Popover.Trigger>
            <Popover.Content>
              <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
                {post.userId === session.data?.user.id && (
                  <Flex direction={'column'} gap={'3'}>
                    <Button
                      variant="ghost"
                      color="red"
                      onClick={deletePost(post.id)}
                    >
                      Delete post
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Popover.Content>
          </Popover.Root>
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

          <Button
            color={'gray'}
            variant={'ghost'}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Text color={'gray'} size={'1'}>
              {post.comments.length} comments
            </Text>
          </Button>
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
            {post.comments.map((comment) => (
              <Flex key={comment.id} gap={'3'}>
                <Avatar
                  size="2"
                  src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                  radius="full"
                  fallback={comment.user.name[0]}
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
                  <Flex
                    justify={'between'}
                    align={'center'}
                    className={'pl-2 pr-2'}
                  >
                    <Text size={'1'} color={'gray'}>
                      {getTimeAgo(comment.createdAt)}
                    </Text>

                    <Popover.Root>
                      <Popover.Trigger>
                        <Button variant="ghost" color={'gray'}>
                          <HiOutlineDotsHorizontal />
                        </Button>
                      </Popover.Trigger>
                      <Popover.Content>
                        <Flex
                          direction="column"
                          gap="3"
                          style={{ maxWidth: 500 }}
                        >
                          {comment.userId === session.data?.user.id && (
                            <Flex direction={'column'} gap={'3'}>
                              <Button
                                variant="ghost"
                                color="red"
                                onClick={deleteComment(comment.id)}
                              >
                                Delete comment
                              </Button>
                            </Flex>
                          )}
                        </Flex>
                      </Popover.Content>
                    </Popover.Root>
                  </Flex>
                </Flex>
              </Flex>
            ))}
          </Flex>
          <form
            className={'pt-5'}
            onSubmit={handleSubmit(async (data) => {
              console.log(data);
              try {
                const res = await fetch(`/api/posts/${post.id}/comment`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ content: data.content }),
                });
              } catch (error) {
                console.log(error);
              }
              console.log('submitted');
            })}
          >
            <Flex gap="3" justify={'between'} align={'center'}>
              <Avatar
                size="2"
                src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                radius="full"
                fallback={session.data?.user.name[0]}
              />
              <TextField.Root className={'w-full'}>
                <TextField.Input
                  placeholder="Reply to comment…"
                  {...register('content')}
                />
              </TextField.Root>

              <Button variant={'ghost'} color={'gray'}>
                <AiOutlineSend />{' '}
              </Button>
            </Flex>
          </form>
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
