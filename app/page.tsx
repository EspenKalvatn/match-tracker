'use client';
import React from 'react';
import { Flex } from '@radix-ui/themes';
import PostComponent from '../app/components/PostComponent';
import { useQuery } from '@tanstack/react-query';
import { Post } from '@/app/types/Post';

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('/api/posts');
  const data = await response.json();
  return data;
};

export default function Home() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Flex gap="5" direction="column" align="center">
      {posts &&
        posts.map((post) => <PostComponent key={post.id} post={post} />)}
    </Flex>
  );
}
