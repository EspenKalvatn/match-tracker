'use client';
import React, { useEffect, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import PostComponent from './components/post/PostComponent';
import { useQuery } from '@tanstack/react-query';
import { Post } from '@/app/types/Post';

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('/api/posts');
  return await response.json();
};

export default function Home() {
  const [postsData, setPostsData] = useState<Post[]>([]); // Assuming you have a Post type

  const updatePosts = (updatedPosts: Post[]) => {
    setPostsData(updatedPosts);
  };

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  useEffect(() => {
    if (posts) {
      setPostsData(posts);
    }
  }, [posts]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading posts</p>;
  }

  return (
    <Flex gap="5" direction="column" align="center">
      {postsData.map((post) => (
        <PostComponent key={post.id} post={post} updatePosts={updatePosts} />
      ))}
    </Flex>
  );
}
