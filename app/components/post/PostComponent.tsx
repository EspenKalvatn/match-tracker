import React, { useEffect, useState } from 'react';
import { Button, Card, Flex, Popover, Separator, Text } from '@radix-ui/themes';

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

interface PostComponentProps {
  post: Post;
  updatePosts: (updatedPosts: Post[]) => void;
}

const PostComponent: React.FC<PostComponentProps> = ({ post, updatePosts }) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const [postData, setPostData] = useState(post);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(
    postData.likes.map((like) => like.userId).includes(user?.id),
  );
  const [likeCount, setLikeCount] = useState(postData.likes.length);

  useEffect(() => {
    // Update the component state with the initial post data
    setPostData(post);
  }, [post]);

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const updatedPostResponse = await fetch(`/api/posts/${post.id}`);
        const updatedPostData = await updatedPostResponse.json();

        setPostData(updatedPostData);
      } else {
        console.error('Failed to update like');
        setIsLiked(!isLiked);
      }
    } catch (error) {
      setIsLiked(!isLiked);
      console.error('Error updating like:', error);
    }
  };

  const handleCommentSubmit = async (data: CommentFormData) => {
    try {
      const res = await fetch(`/api/posts/${postData.id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: data.content }),
      });

      if (res.ok) {
        console.log('Comment submitted successfully');

        // Fetch the updated post data
        const updatedPostResponse = await fetch(`/api/posts/${postData.id}`);
        const updatedPostData = await updatedPostResponse.json();

        // Update the component state with the new post data
        setPostData(updatedPostData);
        setIsExpanded(true); // Optionally, expand the comment section
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const deleteComment = (commentId: string) => async () => {
    try {
      const res = await fetch(`/api/posts/${postData.id}/comment/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });
      if (res.ok) {
        const updatedPostResponse = await fetch(`/api/posts/${post.id}`);
        const updatedPostData = await updatedPostResponse.json();
        setPostData(updatedPostData);
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const deletePost = (postId: string) => async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        // Fetch updated posts and call the updatePosts function
        const updatedPostsResponse = await fetch('/api/posts');
        const updatedPosts = await updatedPostsResponse.json();
        updatePosts(updatedPosts);
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {}
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentForm>({
    resolver: zodResolver(createCommentSchema),
  });

  if (postData.id === '65b5849531f9589fb66e0fe9') {
    console.log('post', post);
    console.log('comments', postData.comments.length);
  }

  return (
    <Card style={{ width: 500 }} className={'p-4'}>
      <Flex gap="3" direction="column">
        <Flex justify={'between'}>
          <PostHeader
            user={postData.user}
            createdAt={getTimeAgo(postData.createdAt)}
          />
          <OptionsMenu
            userId={postData.userId}
            currentUserId={session.data?.user.id}
            onDelete={deletePost(postData.id)}
          >
            Delete post
          </OptionsMenu>
        </Flex>

        <MatchDetails post={postData} />

        <Flex gap="5" align="center">
          <Flex direction="column" className="flex-1">
            <Text as="div" size="1" color="gray">
              Competition
            </Text>
            <Text as="div" size="2">
              {postData.match.competition}
            </Text>
          </Flex>
          <Flex direction="column" className="flex-1">
            <Text as="div" size="1" color="gray">
              Ground name
            </Text>
            <Text as="div" size="2">
              {postData.match.stadium}
            </Text>
          </Flex>
        </Flex>

        <PostContent content={postData.content} />

        <Flex align="stretch" justify="between" className="">
          <Popover.Root>
            <Popover.Trigger>
              <Text color={'gray'} size={'1'}>
                {postData.likes.length} likes
              </Text>
            </Popover.Trigger>
            <Popover.Content>
              <Flex direction="column" gap="3" style={{ maxWidth: 500 }}>
                {postData.likes.map((like) => (
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
              {postData.comments.length} comments
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
          <Flex
            direction="column"
            gap="3"
            style={{ maxWidth: 500 }}
            className={'pb-4'}
          >
            {postData.comments.map((comment) => (
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
