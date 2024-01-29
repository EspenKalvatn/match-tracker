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

import { AiOutlineSend } from 'react-icons/ai';
import { Post } from '@/app/types/Post';
import { createCommentSchema } from '@/app/validationSchemas';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import PostHeader from '@/app/components/post/PostHeader';
import MatchDetails from '@/app/components/post/MatchDetails';
import PostContent from '@/app/components/post/PostContent';
import PostActions from '@/app/components/post/PostActions';
import OptionsMenu from '@/app/components/post/OptionsMenu';
import { getTimeAgo } from '@/app/utils/DateTimeHelper';
import Comment from '@/app/components/post/Comment';
import CommentForm, {
  CommentFormData,
} from '@/app/components/post/CommentForm';

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

  const handleCommentSubmit = async (data: CommentFormData) => {
    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: data.content }),
      });

      if (res.ok) {
        console.log('Comment submitted successfully');
        // Optionally, you can update the UI with the new comment without reloading the entire page.
        // Fetch the updated post data and set it in the component state.
        // For simplicity, you can reload the entire page for now.
        location.reload();
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const deleteComment = (commentId: string) => async () => {
    console.log('delete comment');
    const res = await fetch(`/api/posts/${post.id}/comment/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commentId }),
    });
    console.log('deleted comment');
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

  return (
    <Card style={{ width: 500 }} className={'p-4'}>
      <Flex gap="3" direction="column">
        <Flex justify={'between'}>
          <PostHeader user={post.user} createdAt={getTimeAgo(post.createdAt)} />
          <OptionsMenu
            userId={post.userId}
            currentUserId={session.data?.user.id}
            onDelete={deletePost(post.id)}
          >
            Delete post
          </OptionsMenu>
        </Flex>

        <MatchDetails post={post} />

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

        <PostContent content={post.content} />

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

        <PostActions
          handleLike={handleLike}
          isLiked={isLiked}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
        />
      </Flex>

      {isExpanded && (
        <div>
          <Separator my="3" size="4" />
          <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
            {post.comments.map((comment) => (
              <Comment
                comment={comment}
                sessionUserId={session.data?.user.id}
                deleteComment={deleteComment(comment.id)}
              />
            ))}
          </Flex>
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>
      )}
    </Card>
  );
};
export default PostComponent;
