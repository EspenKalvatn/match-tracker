'use client';
import React, { useState } from 'react';
import { Button, TextField, Callout, Text, Card, Flex } from '@radix-ui/themes';
import 'easymde/dist/easymde.min.css';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createMatchSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

type MatchForm = z.infer<typeof createMatchSchema>;

const NewMatchPage = () => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [matchId, setMatchId] = useState('');

  const router = useRouter();
  const session = useSession();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MatchForm>({
    resolver: zodResolver(createMatchSchema),
  });

  return (
    <Flex justify={'center'} align={'center'}>
      {!showPostDialog && (
        <Card className="w-[450px]  p-5">
          {error && (
            <Callout.Root className="mb-5" color="red">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
          <form
            className=" space-y-3"
            onSubmit={handleSubmit(async (data) => {
              try {
                setIsSubmitting(true);
                const userId = session.data?.user.id;
                const match = await axios.post('/api/matches', {
                  ...data,
                  userId,
                });
                if (match.status === 201) {
                  setMatchId(match.data.id);
                  setShowPostDialog(true);
                }
              } catch (error) {
                setIsSubmitting(false);
                setError('An unexpected error occured');
              }
              setIsSubmitting(false);
            })}
          >
            <Flex justify={'start'}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      const formattedDate = date ? date.toISOString() : null;
                      field.onChange(formattedDate);
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select a date"
                  />
                )}
              />
              <ErrorMessage>{errors.date?.message}</ErrorMessage>
            </Flex>

            <Flex justify={'between'}>
              <Flex direction={'column'} className={'w-[250px]'}>
                <TextField.Root>
                  <TextField.Input
                    placeholder="Home team"
                    {...register('homeTeam')}
                  />
                </TextField.Root>
                <ErrorMessage>{errors.homeTeam?.message}</ErrorMessage>
              </Flex>
              <Flex direction={'column'} className={'w-[100px]'}>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    placeholder="Home score"
                    {...register('homeScore', { valueAsNumber: true })}
                  />
                </TextField.Root>
                <ErrorMessage>{errors.homeScore?.message}</ErrorMessage>
              </Flex>
            </Flex>

            <Flex justify={'between'}>
              <Flex direction={'column'} className={'w-[250px]'}>
                <TextField.Root>
                  <TextField.Input
                    placeholder="Away team"
                    {...register('awayTeam')}
                  />
                </TextField.Root>
                <ErrorMessage>{errors.awayTeam?.message}</ErrorMessage>
              </Flex>
              <Flex direction={'column'} className={'w-[100px]'}>
                <TextField.Root>
                  <TextField.Input
                    type="number"
                    placeholder="Away score"
                    {...register('awayScore', { valueAsNumber: true })}
                  />
                </TextField.Root>
                <ErrorMessage>{errors.awayScore?.message}</ErrorMessage>
              </Flex>
            </Flex>

            <TextField.Root>
              <TextField.Input placeholder="Stadium" {...register('stadium')} />
            </TextField.Root>
            <ErrorMessage>{errors.stadium?.message}</ErrorMessage>

            <TextField.Root>
              <TextField.Input
                placeholder="Competition"
                {...register('competition')}
              />
            </TextField.Root>
            <ErrorMessage>{errors.competition?.message}</ErrorMessage>

            <Flex gap={'3'} justify={'end'} className={'pt-5'}>
              <Button color={'gray'} variant={'outline'}>
                <Link href={'/matches'} className={'cursor-default'}>
                  Cancel
                </Link>
              </Button>
              <Button disabled={isSubmitting}>
                Add match
                {isSubmitting && <Spinner />}
              </Button>
            </Flex>
          </form>
        </Card>
      )}

      {showPostDialog && (
        <Card className="w-[450px]  p-5">
          <Flex
            gap={'4'}
            justify={'center'}
            align={'center'}
            direction={'column'}
          >
            <Text size="4">Match added successfully!</Text>
            <Text size="4">Do you want to share the match with others?</Text>
            <Flex gap={'5'}>
              <Button
                size={'3'}
                color={'gray'}
                variant={'outline'}
                onClick={() => {
                  router.push('/matches');
                }}
              >
                No
              </Button>
              <Button
                size={'3'}
                onClick={() => {
                  router.push(`/posts/new/${matchId}`);
                }}
              >
                Yes
              </Button>
            </Flex>
          </Flex>
        </Card>
      )}
    </Flex>
  );
};

export default NewMatchPage;
