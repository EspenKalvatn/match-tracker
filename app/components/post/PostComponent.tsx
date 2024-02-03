import React, { useState } from 'react';
import { Button, Card, Flex, Popover, Separator, Text } from '@radix-ui/themes';

import { Post } from '@/app/types/Post';
import { useSession } from 'next-auth/react';
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
import AdditionalMatchDetails from '@/app/components/post/AdditionalMatchDetails';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  commentPost,
  deleteCommentPost,
  deletePost,
  likePost,
  unlikePost,
} from '@/app/api';

interface PostComponentProps {
  post: Post;
}

const PostComponent: React.FC<PostComponentProps> = ({ post }) => {
  const session = useSession();
  const user = session.data?.user;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes.map((like) => like.userId).includes(user?.id),
  );

  const queryClient = useQueryClient();

  const { mutate: likePostMutation } = useMutation({
    mutationFn: (postId: string) => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch((err) => {
        // TODO: Handle error
      });
    },
    onMutate: () => {
      // TODO: Do something
    },
  });

  const { mutate: unlikePostMutation } = useMutation({
    mutationFn: (postId: string) => unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch((err) => {
        // TODO: Handle error
      });
    },
    onMutate: () => {
      // TODO: Do something
    },
  });

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch((err) => {
        // TODO: Handle error
      });
    },
    onMutate: () => {
      // TODO: Do something
    },
  });

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: (commentId: string) => deleteCommentPost(post.id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch((err) => {
        // TODO: Handle error
      });
    },
    onMutate: () => {
      // TODO: Do something
    },
  });

  const { mutate: commentMutation } = useMutation({
    mutationFn: (data: CommentFormData) => commentPost(post.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }).catch((err) => {
        // TODO: Handle error
      });
    },
    onMutate: () => {
      // TODO: Do something
    },
  });

  const handleLike = async () => {
    try {
      if (isLiked) {
        setIsLiked(false);
        unlikePostMutation(post.id);
      } else {
        setIsLiked(true);
        likePostMutation(post.id);
      }
    } catch (error) {
      setIsLiked(!isLiked);
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async (data: CommentFormData) => {
    commentMutation(data);
  };

  const handleDeleteComment = (commentId: string) => async () => {
    deleteCommentMutation(commentId);
  };

  const handleDeletePost = () => async () => {
    deletePostMutation(post.id);
  };

  return (
    <Card style={{ width: 500 }} className={'p-4'}>
      <Flex gap="3" direction="column">
        <Flex justify={'between'}>
          <PostHeader user={post.user} createdAt={getTimeAgo(post.createdAt)} />
          <OptionsMenu
            userId={post.userId}
            currentUserId={session.data?.user.id}
            onDelete={handleDeletePost()}
          >
            Delete post
          </OptionsMenu>
        </Flex>

        <MatchDetails match={post.match} />

        <AdditionalMatchDetails match={post.match} />

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

          <div>
            <Button
              color={'gray'}
              variant={'ghost'}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Text color={'gray'} size={'1'}>
                {post.comments.length} comments
              </Text>
            </Button>
          </div>
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
          <Flex
            direction="column"
            gap="3"
            style={{ maxWidth: 500 }}
            className={'pb-4'}
          >
            {post.comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                sessionUserId={session.data?.user.id}
                deleteComment={handleDeleteComment(comment.id)}
              />
            ))}
          </Flex>
          <CommentForm onSubmit={handleComment} />
        </div>
      )}
    </Card>
  );
};
export default PostComponent;
