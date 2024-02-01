import { CommentFormData } from '@/app/components/post/CommentForm';
import { Post } from '@/app/types/Post';

const likePost = async (postId: string) => {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const unlikePost = async (postId: string) => {
  const response = await fetch(`/api/posts/${postId}/like`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const getPosts = async (): Promise<Post[]> => {
  const response = await fetch('/api/posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const deletePost = async (postId: string) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

const commentPost = async (postId: string, data: CommentFormData) => {
  const response = await fetch(`/api/posts/${postId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: data.content }),
  });
  return response.json();
};

const deleteCommentPost = async (postId: string, commentId: string) => {
  const response = await fetch(`/api/posts/${postId}/comment/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ commentId }),
  });
  return response.json();
};

export {
  likePost,
  unlikePost,
  getPosts,
  deletePost,
  commentPost,
  deleteCommentPost,
};
