'use client';
import React, { useState } from 'react';
import {
  Button,
  Callout,
  Card,
  Flex,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPostSchema } from '@/app/validationSchemas';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@/app/components/Spinner';
import { useSession } from 'next-auth/react';
import MatchDetails from '@/app/components/post/MatchDetails';
import AdditionalMatchDetails from '@/app/components/post/AdditionalMatchDetails';
import PostHeader from '@/app/components/post/PostHeader';

type PostForm = z.infer<typeof createPostSchema>;

const NewPostPage = ({ params }: { params: { matchId: string } }) => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const session = useSession();

  const {
    data: match,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['match', params.matchId],
    queryFn: async () => {
      const res = await fetch(`/api/matches/${params.matchId}`);
      return await res.json();
    },
  });

  const { register, handleSubmit } = useForm<PostForm>({
    resolver: zodResolver(createPostSchema),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading matches</p>;
  }

  return (
    <Flex justify={'center'} align={'center'}>
      <Card className="w-[500px]  p-4">
        {error && (
          <Callout.Root className="mb-5" color="red">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <form
          onSubmit={handleSubmit(async (data) => {
            try {
              setIsSubmitting(true);
              const body = {
                content: data.content,
                matchId: params.matchId,
                userId: session.data?.user.id,
              };
              const post = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
              });
              console.log('submitted post', post);
            } catch (error) {
              setIsSubmitting(false);
              setError('An unexpected error occurred');
            }
            setIsSubmitting(false);
            router.push('/');
          })}
        >
          <Flex direction={'column'} gap={'3'}>
            <PostHeader user={match.user} createdAt={''} />

            <MatchDetails match={match} />
            <AdditionalMatchDetails match={match} />
            <TextField.Root>
              <TextArea
                className={'w-full'}
                placeholder="Write a post about the match..."
                {...register('content')}
              />
            </TextField.Root>
            <Flex justify={'end'} gap={'3'} align={'center'}>
              <div>
                <Button
                  type={'button'}
                  variant={'outline'}
                  color={'gray'}
                  onClick={() => {
                    router.push('/matches');
                  }}
                >
                  Cancel
                </Button>
              </div>
              <div>
                <Button
                  type={'submit'}
                  variant={'solid'}
                  color={'green'}
                  // disabled={isSubmitting}
                >
                  Publish
                  {isSubmitting && <Spinner />}
                </Button>
              </div>
            </Flex>
          </Flex>
        </form>
      </Card>
    </Flex>
  );
};

export default NewPostPage;
