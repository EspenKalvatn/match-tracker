'use client';
import React, { ReactNode, useState } from 'react';
import { Flex } from '@radix-ui/themes';
import Post from '../app/components/Post';

export default function Home() {
  return (
    <Flex gap="5" direction="column" align="center">
      <Post />
      <Post />
    </Flex>
  );
}
