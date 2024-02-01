'use client';
import React from 'react';
import { Flex } from '@radix-ui/themes';
import PostComponent from './components/post/PostComponent';
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '@/app/api';

export default function Home() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['posts'], queryFn: getPosts });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading posts</p>;
  }

  return (
    <Flex gap="5" direction="column" align="center">
      {posts &&
        posts.map((post) => <PostComponent key={post.id} post={post} />)}
    </Flex>
  );
}
